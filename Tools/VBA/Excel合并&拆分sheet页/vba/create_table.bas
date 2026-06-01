Attribute VB_Name = "create_table"
Sub create_table(ByVal sname As String)
Attribute create_table.VB_ProcData.VB_Invoke_Func = " \n14"
'
' 建表语句
'
    
    Dim s_sql As String
    Dim sql_height As Double
    Dim t_name As String '表名
    Dim t_desc As String '表描述
    Dim row_addr As Integer '表字段名结束位置 行号
    Dim end_row As Integer '末行
    
    end_row = 4
    t_name = Range("A3")
    t_desc = Range("B3")
    
'    Sheets(sname).Names.Add name:="sql_create_table", RefersToR1C1:="=R19C1"
'    Sheets(sname).Range("sql_create_table").Value = "建表脚本"
    
    row_addr = Range("sql_create_table").Row
    
    
    '
    '设置允许自动换行 WrapText = True
    '行高 RowHeight
    '
    With Range("A" & row_addr + 1)
        .WrapText = True
        .RowHeight = 250
    End With
    '合并单元格
    Range("A" & row_addr + 1 & ":D" & row_addr + 1).Merge
    Range("A" & row_addr + 1 & ":D" & row_addr + 1).Borders.LineStyle = xlContinuous
    
    
    '建表语句
    s_sql = "create table " & t_name & " (" & Chr(10)
    For i = 5 To row_addr - 1 Step 1
        If Range("A" & i) <> "" Then
            end_row = end_row + 1
            s_sql = s_sql & Chr(9) & Range("A" & i) & " " & Range("B" & i)
            If Range("C" & i) = "N" Then
               s_sql = s_sql & " not null"
            End If
            If i < row_addr - 2 Then
                s_sql = s_sql & "," & Chr(10)
            End If
        End If
    Next i
    s_sql = s_sql & Chr(10) & ");" & Chr(10)
    '添加表的描述信息
    s_sql = s_sql & "comment on table " & t_name & " is '" & t_desc & "';" & Chr(10)
    '添加字段备注信息
    For i = 5 To row_addr - 1 Step 1
        If Range("A" & i) <> "" Then
            s_sql = s_sql & "comment on column " & t_name & "." & Range("A" & i) & " is '" & Range("D" & i) & "';" & Chr(10)
        End If
    Next i
    
    Range("A" & row_addr + 1) = s_sql
    
End Sub

Sub do_create()
    Call create_table("tf_phase_diff")
End Sub
