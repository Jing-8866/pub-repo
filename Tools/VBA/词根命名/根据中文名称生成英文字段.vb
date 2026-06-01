Option Explicit  ' 强制变量声明，避免未定义变量导致错误

' 定义两个全局字典对象
' dictCNtoEN：存储中文名 -> 英文词根的映射
' dictAllCNWords：存储所有中文词根，用于语义分词时快速查找
Dim dictCNtoEN As Object
Dim dictAllCNWords As Object

' 初始化字典：从“词根翻译”工作表加载数据
Sub InitDictionary()
    ' 创建字典对象（使用 Scripting.Dictionary 提供快速查找）
    Set dictCNtoEN = CreateObject("Scripting.Dictionary")
    Set dictAllCNWords = CreateObject("Scripting.Dictionary")
    
    Dim wsSource As Worksheet  ' 源工作表变量
    On Error Resume Next  ' 如果工作表不存在，不立即报错
    Set wsSource = ThisWorkbook.Sheets("词根翻译")  ' 定位“词根翻译”表
    On Error GoTo 0  ' 恢复正常的错误处理
    
    ' 如果没找到“词根翻译”表，提示用户并退出
    If wsSource Is Nothing Then
        MsgBox "找不到名为【词根翻译】的工作表，请先创建该表并填入数据！", vbCritical
        Exit Sub
    End If
    
    ' 找到“词根翻译”表最后一行有数据的行号
    Dim lastRow As Long, i As Long
    lastRow = wsSource.Cells(wsSource.Rows.Count, "A").End(xlUp).Row
    
    ' 循环遍历第2行到最后一行，加载数据到字典
    For i = 2 To lastRow
        Dim cnName As String, enAbbr As String  ' 中文名、英文词根
        cnName = Trim(wsSource.Cells(i, 1).Value)  ' 读取A列中文名并去空格
        enAbbr = Trim(wsSource.Cells(i, 2).Value)  ' 读取B列英文词根并去空格
        
        ' 如果中文名不为空，则加入映射字典
        If cnName <> "" Then
            dictCNtoEN(cnName) = enAbbr  ' 建立中文->英文映射
            dictAllCNWords(cnName) = 1  ' 同时加入词根集合，供分词用
        End If
    Next i
End Sub

' 主程序：批量处理 A 列中文词组，生成 B 列下划线拼接英文名
Sub GenerateEnglishNamesWithSemanticSplit()
    Call InitDictionary  ' 先初始化字典
    If dictCNtoEN Is Nothing Then Exit Sub  ' 如果初始化失败则退出
    
    Dim wsTarget As Worksheet  ' 目标工作表（当前活动表）
    Set wsTarget = ActiveSheet
    
    ' 确定处理范围：从第2行开始到F列最后有数据的行
    Dim startRow As Long, lastRow As Long, i As Long
    startRow = 2
    lastRow = wsTarget.Cells(wsTarget.Rows.Count, "F").End(xlUp).Row
    
    ' 逐行处理
    For i = startRow To lastRow
        Dim inputCN As String
        inputCN = Trim(wsTarget.Cells(i, 6).Value)  ' 读取A列中文词组
        If inputCN <> "" Then
            ' 调用翻译与拼接函数，将结果写入B列
            wsTarget.Cells(i, 4).Value = TranslateBySemanticSplit(inputCN)
        End If
    Next i
    
    ' 全部完成后提示
    MsgBox "批量生成完成！", vbInformation
End Sub

' 核心函数：按语义分词并拼接英文名
Function TranslateBySemanticSplit(ByVal cnPhrase As String) As String
    Dim result As String  ' 最终拼接的英文名
    Dim remain As String  ' 尚未处理的剩余中文
    remain = CleanRep(cnPhrase) ' 去掉文本中的符号内容
    
    ' 当还有未处理的中文时，继续循环
    Do While remain <> ""
        Dim foundWord As String, foundEn As String
        foundWord = FindLongestMatch(remain)  ' 在剩余部分找最长匹配词根
        
        If foundWord <> "" Then
            ' 找到匹配词根，获取其英文缩写
            foundEn = dictCNtoEN(foundWord)
            ' 拼接到结果中
            If result = "" Then
                result = foundEn
            Else
                result = result & "_" & foundEn
            End If
            ' 从剩余部分去掉已匹配的词根
            remain = Mid(remain, Len(foundWord) + 1)
        Else
            ' 没有匹配到词根，保留首字并标记未匹配
            If result = "" Then
                result = Left(remain, 1) & "[?]"  ' 首字加[?]
            Else
                result = result & "_" & Left(remain, 1) & "[?]"
            End If
            ' 去掉已处理的首字
            remain = Mid(remain, 2)
        End If
        
        ' 去除剩余部分开头的空格
        remain = LTrim(remain)
    Loop
    
    ' 返回最终拼接的英文名
    TranslateBySemanticSplit = result
End Function

' 辅助函数：在给定文本中查找最长匹配的词根
Function FindLongestMatch(ByVal text As String) As String
    Dim maxLen As Long, matchWord As String
    maxLen = 0
    matchWord = ""
    
    Dim key As Variant  ' 遍历词根字典的每个键
    For Each key In dictAllCNWords.Keys
        ' 如果当前词根长度大于已找到的最长长度
        If Len(key) > maxLen Then
            ' 并且该词根与text的开头相同
            If Left(text, Len(key)) = key Then
                maxLen = Len(key)  ' 更新最长长度
                matchWord = key    ' 记录匹配词根
            End If
        End If
    Next key
    
    ' 返回找到的最长匹配词根（没有则返回空串）
    FindLongestMatch = matchWord
End Function



' 新增函数：清除中文名称中的符号内容
Function CleanRep(ByVal inputStr As String) As String
    Dim symbols As Variant
    ' 定义要清除的符号集合
    symbols = Array("/", "\", "（", "）", "(", ")", "[", "]", "{", "}", ".", ",", ";", ":", "'", """", "-", "_", "·", " ", Chr(10), Chr(13))
    
    Dim i As Long
    Dim tempStr As String
    tempStr = inputStr  ' 复制输入字符串
    
    ' 遍历符号数组，逐一用 Replace 删除
    For i = LBound(symbols) To UBound(symbols)
        tempStr = Replace(tempStr, symbols(i), "")  ' 删除当前符号
    Next i
    
    CleanRep = tempStr  ' 返回清除符号后的字符串
End Function
