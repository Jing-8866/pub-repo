Attribute VB_Name = "main"
Sub main()
    Dim name As String
    name = InputBox("" & Chr(13) & "【提示：取消或不输入名称可以直接退出】", "请输入复制后的sheet页名称")
    If name <> "" Then
        'Call copy.copy_sheet(name) '复制sheet页
        'Call sort.sort_sheet(name) '排序
        Call split_sheet_rand(name)
    Else
        MsgBox prompt:="未输入名称，退出程序！", Buttons:=vbExclamation
    End If
End Sub
