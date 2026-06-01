Attribute VB_Name = "test"
Sub link_test()
    'ActiveSheet.Hyperlinks.Add Anchor:=Selection, Address:="", SubAddress:="样式!A1", TextToDisplay:="返回"
    ActiveSheet.Hyperlinks.Add Anchor:=Range("A1"), Address:="", SubAddress:="样式!A1", TextToDisplay:="返回"
End Sub

Sub del_sheet_by_name(ByVal sname As String)
'
'删除sheet页
'
    Application.DisplayAlerts = False
    Worksheets(sname).Delete
    Application.DisplayAlerts = True
End Sub

Sub a()
  Dim btn As Button
  Application.ScreenUpdating = False
  ActiveSheet.Buttons.Delete
  Dim t As Range
  For i = 2 To 6 Step 2
    Set t = ActiveSheet.Range(Cells(i, 3), Cells(i, 3))
    Set btn = ActiveSheet.Buttons.Add(t.Left, t.Top, t.Width, t.Height)
    With btn
      .OnAction = "btnS"
      .Caption = "Btn " & i
      .name = "Btn" & i
    End With
  Next i
  Application.ScreenUpdating = True
End Sub

Sub b()
    Dim btn As Button
    Application.ScreenUpdating = False
    ActiveSheet.Buttons.Delete
    Dim t As Range
    
    '按钮名称
    Const btn_name = "Btn"
    
    '按钮 caption 名称
    Const btn_caption = "生成脚本"
    
    '按钮点击事件名称
    Const btn_onaction = "create_table"
    
    Set t = ActiveSheet.Range("C2")
    Set btn = ActiveSheet.Buttons.Add(t.Left, t.Top, t.Width, t.Height)
    With btn
      .OnAction = btn_onaction
      .Caption = btn_caption
      .name = btn_name
    End With
    
    ActiveSheet.Shapes.Range(Array(btn_name)).Select
    With Selection.Font
        .name = "微软雅黑"
        .Size = 10
    End With
    Range("D2").Select
    
    
'    Sheets(sname).Names.Add name:="sql_create_table", RefersToR1C1:="=R19C1"
'    Sheets(sname).Range("sql_create_table").Value = "建表脚本"
    
    
    
    
    Application.ScreenUpdating = True
End Sub

