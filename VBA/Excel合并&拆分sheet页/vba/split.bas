Attribute VB_Name = "split"

Sub split_sheet_rand(ByVal ods_date As String)
    Dim row_count As Integer '获取总行数
    Dim row_begin As Integer '数据粘贴起始行号
    Dim k As Integer, m As Integer
    Dim sheet_number As Integer 'sheet页数
    Dim del_name As String
    k = 2
    m = k
    row_count = Sheets(ods_date).Range("A65535").End(xlUp).Row '获取行数
    
    Dim source_sheet As Object
    Set source_sheet = Sheets(ods_date)
    For i = 2 To row_count Step 1
        del_name = Left(source_sheet.Range("A" & i), 31)
        
        On Error Resume Next
        Set is_flg = Sheets(del_name)
        If is_flg Is Nothing Then
            
        Else
            Application.DisplayAlerts = False
            Worksheets(del_name).Delete
            Application.DisplayAlerts = True
        End If
        
    Next i
    
    For i = 2 To row_count Step 1
        If source_sheet.Range("A" & i) <> source_sheet.Range("A" & k) And k <= row_count Then
            k = m
        End If

        If k = i Then
            sheet_name = source_sheet.Range("A" & k)
            
            Worksheets.Add After:=Worksheets(Worksheets.Count)
            ActiveSheet.name = Left(sheet_name, 31)
            ActiveSheet.Hyperlinks.Add Anchor:=Range("A1"), Address:="", SubAddress:=ods_date & "!A" & k, TextToDisplay:="返回 " & ods_date & "页" '超链接
            Call table_header(Left(sheet_name, 31))
            
            Sheets(Left(sheet_name, 31)).Range("A3") = source_sheet.Range("A" & k)
            Sheets(Left(sheet_name, 31)).Range("B3") = source_sheet.Range("B" & k)
            row_begin = 5
        End If

        If source_sheet.Range("A" & i) = source_sheet.Range("A" & k) Then
            Sheets(Left(sheet_name, 31)).Range("A" & row_begin) = source_sheet.Range("C" & i)
            Sheets(Left(sheet_name, 31)).Range("B" & row_begin) = source_sheet.Range("D" & i)
            Sheets(Left(sheet_name, 31)).Range("C" & row_begin) = source_sheet.Range("E" & i)
            Sheets(Left(sheet_name, 31)).Range("D" & row_begin) = source_sheet.Range("F" & i)
            row_begin = row_begin + 1
            m = m + 1
        End If
        ActiveSheet.Range("A6:D" & (row_begin - 1)).Borders.LineStyle = xlContinuous
        ActiveSheet.Columns.AutoFit
        
       
        If source_sheet.Range("A" & i) <> source_sheet.Range("A" & k) And k <= row_count Then
            k = m
        End If
        
        
        ActiveSheet.Names.Add name:="sql_create_table", RefersToR1C1:="=R" & row_begin + 1 & "C1"
        ActiveSheet.Range("sql_create_table").Value = "建表脚本"
        
        'Call create_table.create_table(Left(sheet_name, 31))
        
    Next i
End Sub


Sub table_header(ByVal sheetname As String)
'
'表头设置
'
'
    '设置sheet也字体及大小
    With Sheets(sheetname).Cells.Font
        .name = "微软雅黑"
        .Size = 10
    End With
    
    '''''''''''''''''表头begin''''''''''''
    Dim table_title As Object
    Set table_title = Sheets(sheetname).Range("A2,B2,A4,B4,C4,D4")
    With table_title.Interior
        .ThemeColor = xlThemeColorAccent3
        .TintAndShade = 0.399975585192419
    End With
    table_title.Cells.Font.Bold = True
    With table_title
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
    End With
    table_title.Borders.LineStyle = xlContinuous
    With Sheets(sheetname)
        .Range("A2") = "表名"
        .Range("B2") = "备注"
        .Range("A4") = "字段名"
        .Range("B4") = "数据类型"
        .Range("C4") = "是否允许为空"
        .Range("D4") = "备注"
        .Range("A3,B3").Borders.LineStyle = xlContinuous
    End With
    
    '''''''''''''''''表头end''''''''''''
    'Sheets(sheetname).Columns.AutoFit
End Sub

