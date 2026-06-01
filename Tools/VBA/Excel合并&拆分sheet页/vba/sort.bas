Attribute VB_Name = "sort"
Sub sort_sheet(ByVal sheetname As String)
'
' 排序
'
    row_count = Sheets(sheetname).Range("A65535").End(xlUp).Row '获取行数
    ActiveSheet.sort.SortFields.Clear
    ActiveSheet.sort.SortFields.Add Key:=Range("A1"), _
        SortOn:=xlSortOnValues, _
        Order:=xlDescending, _
        DataOption:=xlSortTextAsNumbers
        
        '排序 xlDescending,xlAscending
        
    With ActiveWorkbook.Worksheets(sheetname).sort
        .SetRange Range("A2:F" & row_count)
        .Header = xlNo
        .MatchCase = False
        .Orientation = xlTopToBottom
        .SortMethod = xlPinYin
        .Apply
    End With
End Sub

