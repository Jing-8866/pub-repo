Attribute VB_Name = "Ä£¿é1"
Sub ºê4()
Attribute ºê4.VB_ProcData.VB_Invoke_Func = " \n14"
'
' ºê4 ºê
'

'
    'ActiveSheet.Shapes.AddShape(msoShapeRoundedRectangle, 96, 15, 68.25, 16.5).Select
    ActiveSheet.Shapes.AddShape(msoShapeRoundedRectangle, 96, 15, 68.25, 16.5).Select
    
    
    ActiveSheet.Shapes.Range(Array("Rounded Rectangle 18")).Select
    Selection.ShapeRange.Line.Visible = msoFalse
        
    Selection.ShapeRange.Fill.ForeColor.RGB = RGB(255, 192, 0)
'    With Selection.ShapeRange(1).TextFrame2.TextRange.Characters(1, 4).Font.Fill
'        '.Visible = msoTrue
'        .ForeColor.RGB = RGB(255, 0, 0)
'        '.Transparency = 0
'        '.Solid
'    End With
    Selection.ShapeRange.TextFrame2.VerticalAnchor = msoAnchorMiddle
    Selection.ShapeRange(1).TextFrame2.TextRange.Characters.Text = "Éú³É½Å±¾"
    Selection.ShapeRange(1).TextFrame2.TextRange.Characters(1, 4).ParagraphFormat.Alignment = msoAlignCenter
    
    With Selection.ShapeRange(1).TextFrame2.TextRange.Characters(1, 4).Font
        .Fill.ForeColor.RGB = RGB(255, 0, 0)
        .Size = 10
    End With
    ActiveSheet.Shapes.Range(Array("Rounded Rectangle 2")).Select
    Columns("C:C").EntireColumn.AutoFit
End Sub
Sub ºê6()
Attribute ºê6.VB_ProcData.VB_Invoke_Func = " \n14"
'
' ºê6 ºê
'

'
    ActiveSheet.Shapes.Range(Array("Rounded Rectangle 18")).Select
    Selection.ShapeRange.Line.Visible = msoFalse
End Sub
Sub ºê7()
Attribute ºê7.VB_ProcData.VB_Invoke_Func = " \n14"
'
' ºê7 ºê
'

'
    ActiveSheet.Shapes.Range(Array("Btn")).Select
    With Selection.Font
        .name = "Î¢ÈíÑÅºÚ"
        .FontStyle = "³£¹æ"
        .Size = 10
        .Strikethrough = False
        .Superscript = False
        .Subscript = False
        .OutlineFont = False
        .Shadow = False
        .Underline = xlUnderlineStyleNone
        .ThemeColor = xlThemeColorLight1
        .TintAndShade = 0
        .ThemeFont = xlThemeFontMinor
    End With
    Range("C6").Select
End Sub
