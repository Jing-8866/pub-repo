Attribute VB_Name = "copy"
Sub copy_sheet(ByVal sheetname As String)
    '
    ' 备份数据源
    '
    Dim is_flg As Object
    Dim msg1 As String
    Dim msg2 As String
    Dim msg3 As String
    
    On Error Resume Next
    Set is_flg = Sheets(sheetname)
    If is_flg Is Nothing Then
        'MsgBox sheetName & "不存在"
        GoTo copy_sheet
    Else
        Dim vbbox As Integer
        myvbTitle = "名称冲突"
        myvbButtons = vbYesNoCancel + vbQuestion
        myvbprompt = sheetname & "已存在，是否替换原来的sheet页?" & Chr(13) & Chr(13) & "是：替换" & Chr(13) & "否：重命名" & Chr(13) & "取消：退出程序"
        vbbox = MsgBox(prompt:=myvbprompt, Buttons:=myvbButtons, Title:=myvbTitle)
        If vbbox = vbYes Then '替换
            Application.DisplayAlerts = False '关闭弹窗框提示
            Worksheets(sheetname).Delete '删除sheetname
            Application.DisplayAlerts = True '打开弹窗框提示
            GoTo copy_sheet
        ElseIf vbbox = vbNo Then '重命名
            main.main '重新执行main.main()方法
            Exit Sub
        Else '取消
            Exit Sub
        End If
    End If
copy_sheet:
'
'复制sheetname
'
    Sheets("sheet1").copy After:=Workbooks.Application.Sheets("样式")
    ActiveSheet.Unprotect
    ActiveSheet.name = sheetname 'sheet页重命名
    row_count = ActiveSheet.Range("A65535").End(xlUp).Row '获取行数
    ActiveSheet.Range("A1:E" & row_count).Borders.LineStyle = xlContinuous
    ActiveSheet.Columns.AutoFit

End Sub


