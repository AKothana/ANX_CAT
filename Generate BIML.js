//Paul K
importPackage(java.lang);
importPackage(java.util);
importPackage(com.ads.forms);
importPackage(com.ads.mm.db.dao);
importPackage(com.ads.mm.db.util);
importPackage(com.ads.mm.etl.xml.mapping);
importPackage(com.cs.cmm.admin.systables.form);
importPackage(com.icc.dwr);
importPackage(com.icc.mappingmanager.dao);
importPackage(com.icc.mappingmanager.util);
importPackage(com.icc.mappingmanager.vo);
importPackage(com.icc.resourcemanager.dao);
importPackage(com.icc.resourcemanager.util);
importPackage(com.icc.systemmanager.dao);
importPackage(com.icc.systemmanager.dataloading);
importPackage(com.icc.systemmanager.util);
importPackage(com.icc.systemmanager.vo);
importPackage(com.icc.util);

//get reference to mapping objects, MAPPING is global variable
var mapping = MAPPING;

function execute() {

    var sb = new java.lang.StringBuffer();
    
    sb.append(CreateHeader());
    sb.append(CreateConnections());
    sb.append(CreateScriptComponentProject());
    sb.append(CreatePackageHeader());
    sb.append(TruncateUtilityTable());
    sb.append(CreateSourceExtractDataflow());
    sb.append(CreateStoredProcTasks());
    sb.append(CreateValidationTask());
    sb.append(CreateTargetDataflows());
    sb.append(CreatePackageFooter());
    sb.append(CreateFooter());

    return sb;
}

function CreateHeader() {
    var ch = new java.lang.StringBuffer();
    ch.append("<Biml xmlns=\"http://schemas.varigence.com/biml.xsd\">\n");
    return ch;
}

function CreateConnections() {
    var cb = new java.lang.StringBuffer();
    // Use getSystemName to get the Target Database name
    cb.append("    <Connections>\n");
    // cb.append("        <OleDbConnection Name=\"IngestAutomationUtil\" ConnectionString=\"Data Source=tul1dsiaqdb01;Initial Catalog=IngestAutomationUtils;Provider=SQLNCLI11.1;Integrated Security=SSPI;Auto Translate=False;\"/>\n");
    // cb.append("        <OleDbConnection Name=\"IngestAutomationStage\" ConnectionString=\"Data Source=tul1dsiaqdb01;Initial Catalog=IngestAutomationStage;Provider=SQLNCLI11.1;Integrated Security=SSPI;Auto Translate=False;\"/>\n");
    cb.append("        <OleDbConnection Name=\"IngestAutomationUtil\" ConnectionString=\"Data Source=tul1dsiaqdb01;Initial Catalog=IngestAutomationUtils;Provider=SQLNCLI11.1;Integrated Security=SSPI;Auto Translate=False;\">\n");
    cb.append("           <Expressions>\n");
    cb.append("        <Expression PropertyName=\"IngestAutomationUtil.ConnectionString\">@[User::UtilConnection]</Expression>\n");
    cb.append("            </Expressions>\n");
    cb.append("        </OleDbConnection>\n");
    cb.append("        <OleDbConnection Name=\"IngestAutomationStage\" ConnectionString=\"Data Source=tul1dsiaqdb01;Initial Catalog=IngestAutomationStage;Provider=SQLNCLI11.1;Integrated Security=SSPI;Auto Translate=False;\">\n");
    cb.append("           <Expressions>\n");
    cb.append("        <Expression PropertyName=\"IngestAutomationStage.ConnectionString\">@[User::StageConnection]</Expression>\n");
    cb.append("            </Expressions>\n");
    cb.append("        </OleDbConnection>\n");
    cb.append("    </Connections>\n");
    return cb;
}

function CreateScriptComponentProject() {
    var cscp = new java.lang.StringBuffer();
    var tfrms =  mapping.getTransformations(); 
    cscp.append("    <ScriptProjects>\n");
    cscp.append("        <ScriptComponentProject ProjectCoreName=\"SC_2bca370105ff4883a705860bac68cfba\" Name=\"SourceExtractScript\">\n");
    cscp.append("            <AssemblyReferences>\n");
    //cscp.append("                <AssemblyReference AssemblyPath=\"Microsoft.Office.Interop.Excel, Version=14.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c, processorArchitecture=MSIL\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"Microsoft.SqlServer.DTSPipelineWrap.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"Microsoft.SqlServer.DTSRuntimeWrap.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"Microsoft.SqlServer.PipelineHost.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"Microsoft.SqlServer.TxScript.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"Microsoft.VisualBasic.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"System.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"System.Data.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"System.Windows.Forms.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"System.Xml.dll\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"System.Core, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089, processorArchitecture=MSIL, Custom=null\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"System.Data.Services, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089, processorArchitecture=MSIL, Custom=null\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"System.Data.DataSetExtensions, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089, processorArchitecture=MSIL, Custom=null\" />\n");
    cscp.append("                <AssemblyReference AssemblyPath=\"System.Data.Services.Client, Version=3.5.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089, processorArchitecture=MSIL, Custom=null\" />\n");
    cscp.append("            </AssemblyReferences>\n");
    cscp.append("            <OutputBuffers>\n");
    cscp.append("                <OutputBuffer Name=\"Output0\" IsSynchronous=\"false\">\n");
    cscp.append("                    <Columns>\n");
    cscp.append("                        <Column Name=\"RowNum\" DataType=\"Int32\" />\n");
    cscp.append("                        <Column Name=\"ListingID\" DataType=\"Int64\" />\n");
    cscp.append("                        <Column Name=\"SheetName\" DataType=\"String\" Length=\"100\" />\n");
    cscp.append("                        <Column Name=\"HeaderRowAndPrior\" DataType=\"Boolean\" />\n");
    cscp.append("                        <Column Name=\"FileName\" DataType=\"String\" Length=\"255\" />\n");
    // Filetype Calendar Create Output Buffer Rows Columns1 - 50 with Datatype and Length of (nvarchar(4000) DT_WSTR) in BIML: DataType=\"String\" Length=\"4000\"
    cscp.append(OutputBufferRows());
    cscp.append("                    </Columns>\n");
    cscp.append("                </OutputBuffer>\n");
    cscp.append("            </OutputBuffers>\n");
    cscp.append("            <Files>\n");
    cscp.append("                <File Path=\"main.cs\">\n");
    cscp.append("                    /* Microsoft SQL Server Integration Services Script Component\n");
    cscp.append("                    *  Write scripts using Microsoft Visual C# 2008.\n");
    cscp.append("                    *  ScriptMain is the entry point class of the script.*/\n");
    cscp.append("                    #region Namespaces\n");
    cscp.append("                    using System;\n");
    cscp.append("                    using System.Data;\n");
    cscp.append("                    using System.IO;\n");
    cscp.append("                    using System.Text;\n");
    cscp.append("                    using Microsoft.SqlServer.Dts.Pipeline.Wrapper;\n");
    cscp.append("                    using Microsoft.SqlServer.Dts.Runtime.Wrapper;\n");
    //cscp.append("                    using Excel = Microsoft.Office.Interop.Excel;\n");
    cscp.append("                    using System.Data.OleDb;\n");
    cscp.append("                    using System.Windows.Forms;\n");
    cscp.append("                    using System.Collections;\n");
    cscp.append("                    using System.Collections.Generic;\n");
    cscp.append("                    using Microsoft.VisualBasic.FileIO;\n");
    cscp.append("                    #endregion\n");
    cscp.append("\n");
    cscp.append("[Microsoft.SqlServer.Dts.Pipeline.SSISScriptComponentEntryPointAttribute]\n");
    cscp.append("public class ScriptMain : UserComponent\n");
    cscp.append("{\n");
    cscp.append("\n");
    cscp.append("    private enum FileType { Text, XLS, XLSX };\n");
    cscp.append("    ExcelFile excelFile;\n");
    cscp.append("    TextFile textFile;\n");
    cscp.append("    ArrayList sourceHeaders;\n");
    cscp.append("    string fqFileName;\n");
    cscp.append("    string fileName;\n");
    cscp.append("    Int64 listingID;\n");
    cscp.append("    string tabularCalendar;\n");
    cscp.append("\n");
    cscp.append("    public override void PreExecute()\n");
    cscp.append("    {\n");
    cscp.append("        base.PreExecute();\n");
    cscp.append("        /*\n");
    cscp.append("         * Add your code here\n");
    cscp.append("         */\n");
    cscp.append("\n");
    cscp.append("        fqFileName = Variables.FQFileName.ToString();\n");
    cscp.append("    fileName = GetFileName(fqFileName);\n");
    cscp.append("        listingID = (Int64)Variables.ListingID;\n");
    cscp.append("        tabularCalendar = Variables.TabularCalendar.ToString();\n");
    cscp.append("        sourceHeaders = new ArrayList();\n");
    cscp.append("        PopulateSourceHeaders(sourceHeaders);\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    public override void PostExecute()\n");
    cscp.append("    {\n");
    cscp.append("        base.PostExecute();\n");
    cscp.append("        /*\n");
    cscp.append("         * Add your code here\n");
    cscp.append("         */\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    public override void CreateNewOutputRows()\n");
    cscp.append("    {\n");
    cscp.append("\n");
    cscp.append("        string fileExtension = GetFileExtension(fqFileName);\n");
    cscp.append("\n");
    cscp.append("        switch (fileExtension)\n");
    cscp.append("        {\n");
    cscp.append("            case \"txt\":\n");
    cscp.append("                textFile = new TextFile(sourceHeaders, fqFileName, tabularCalendar, fileExtension);\n");
    cscp.append("                PopulateTextBuffer(textFile);\n");
    cscp.append("                break;\n");
    cscp.append("            case \"csv\":\n");
    cscp.append("                textFile = new TextFile(sourceHeaders, fqFileName, tabularCalendar, fileExtension);\n");
    cscp.append("                PopulateTextBuffer(textFile);\n");
    cscp.append("                break;\n");
    cscp.append("            case \"xls\":\n");
    cscp.append("                excelFile = new ExcelFile(fqFileName,sourceHeaders, fileExtension, tabularCalendar);\n");
    cscp.append("                foreach (ExcelSheet excelSheet in excelFile.ExcelSheets)\n");
    cscp.append("                {\n");
    cscp.append("                    if (excelSheet.HasHeaders == false &amp; tabularCalendar.Equals(\"Tabular_Header\"))\n");
    cscp.append("                    {\n");
    cscp.append("                        //Do Not Populate Excel Buffer\n");
    cscp.append("                    }\n");
    cscp.append("                    else\n");
    cscp.append("                    {\n");
    cscp.append("                        PopulateExcelBuffer(excelFile, excelSheet);\n");
    cscp.append("                    }\n");
    cscp.append("                }\n");
    cscp.append("                break;\n");
    cscp.append("            case \"xlsx\":\n");
    cscp.append("                excelFile = new ExcelFile(fqFileName,sourceHeaders, fileExtension, tabularCalendar);\n");
    cscp.append("                foreach (ExcelSheet excelSheet in excelFile.ExcelSheets)\n");
    cscp.append("                {\n");
    cscp.append("                    if (excelSheet.HasHeaders == false &amp; tabularCalendar.Equals(\"Tabular_Header\"))\n");
    cscp.append("                    {\n");
    cscp.append("                        //Do Not Populate Excel Buffer\n");
    cscp.append("                    }\n");
    cscp.append("                    else\n");
    cscp.append("                    {\n");
    cscp.append("                        PopulateExcelBuffer(excelFile, excelSheet);\n");
    cscp.append("                    }\n");
    cscp.append("                }\n");
    cscp.append("                break;\n");
    cscp.append("            default:\n");
    cscp.append("                throw new Exception(\"Error in SourceComponentScript.  File Type not allowed.  File: \" + fqFileName);\n");
    cscp.append("        }\n");
    cscp.append("\n");  
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    public string GetFileExtension(string fqFileName)\n");
    cscp.append("    {\n");
    cscp.append("        string fileExtension = \"\";\n");
    cscp.append("\n");
    cscp.append("        try\n");
    cscp.append("        {\n");
    cscp.append("            fileExtension = fqFileName.Substring(fqFileName.LastIndexOf('.') + 1).ToLower();\n");
    cscp.append("        }\n");
    cscp.append("        catch (Exception ex)\n");
    cscp.append("        {\n");
    cscp.append("            throw new Exception(\"Error in GetFileExtension method of ScriptSourceComponent. Message: \" + ex.Message);\n");
    cscp.append("        }\n");
    cscp.append("\n");
    cscp.append("        return fileExtension;\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    private void ProcessTextFile(string fqFileName)\n");
    cscp.append("    {\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    private void PopulateExcelBuffer(ExcelFile excelFile, ExcelSheet excelSheet)\n");
    cscp.append("    {\n");
    cscp.append("        OleDbDataReader dr;\n");
    cscp.append("\n");
    cscp.append("        OleDbConnection conn = new OleDbConnection(excelFile.ConnectionString);\n");
    cscp.append("        string cmdString = \"select * from [\" + excelSheet.SheetName + \"]\";\n");
    cscp.append("        OleDbCommand cmd = new OleDbCommand(cmdString, conn);\n");
    cscp.append("        int rowNum = 1;\n");
    cscp.append("        bool headerRowAndPrior = true;\n");
    cscp.append("\n");
    cscp.append("        try\n");
    cscp.append("        {\n");
    cscp.append("            conn.Open();\n");
    cscp.append("            dr = cmd.ExecuteReader();\n");
    cscp.append("\n");
    cscp.append("            while (dr.Read())\n");
    cscp.append("            {\n");
    cscp.append("                if (rowNum > excelSheet.HeaderRowNum)\n");
    cscp.append("                { headerRowAndPrior = false; }\n");
    cscp.append("\n");
    cscp.append("                Output0Buffer.AddRow();\n");
    cscp.append("                Output0Buffer.RowNum = rowNum;\n");
    cscp.append("                Output0Buffer.ListingID = listingID;\n");
    cscp.append("                Output0Buffer.SheetName = excelSheet.SheetName;\n");
    cscp.append("                Output0Buffer.HeaderRowAndPrior = headerRowAndPrior;\n");
    cscp.append("                Output0Buffer.FileName = fileName;\n");
    cscp.append("\n");
    cscp.append(ExcelBufferRows());
    cscp.append("\n");
    cscp.append("                rowNum++;\n");
    cscp.append("            }\n");
    cscp.append("\n");
    cscp.append("            dr.Close();\n");
    cscp.append("        }\n");
    cscp.append("        catch (Exception ex)\n");
    cscp.append("        {\n");
    cscp.append("            throw new Exception(\"Error in PopulateBufferWithHeaders method of ScriptSourceComponent. RowNum: \" + rowNum + \"; Message: \" + ex.Message);\n");
    cscp.append("        }\n");
    cscp.append("        finally\n");
    cscp.append("        {\n");
    cscp.append("            conn.Close();\n");
    cscp.append("        }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    // New PopulateTextBuffer
    cscp.append("    private void PopulateTextBuffer(TextFile textFile)\n");
    cscp.append("    {\n");
    cscp.append("        int rowNum = 1;\n");
    cscp.append("        bool headerRowAndPrior = true;\n");
    cscp.append("        TextFieldParser parser = new TextFieldParser(textFile.FqFileName);\n");
    cscp.append("        string[] columns;\n");
    cscp.append("\n");
    cscp.append("        try\n");
    cscp.append("        {\n");
    
    cscp.append("            if (textFile.FileExtension.Equals(\"csv\"))\n");
    cscp.append("            {\n");
    cscp.append("                parser.HasFieldsEnclosedInQuotes = true;\n");
    cscp.append("                parser.SetDelimiters(\",\");\n");
    cscp.append("            }\n");
    cscp.append("            else\n");
    cscp.append("            {\n");
    cscp.append("                parser.HasFieldsEnclosedInQuotes = true;\n");
    cscp.append("                parser.SetDelimiters(\"\\t\");\n");
    cscp.append("            }\n");
    
    cscp.append("            while (!parser.EndOfData)\n");
    cscp.append("            {\n");
    cscp.append("\n");
    cscp.append("                columns = parser.ReadFields();\n");
    cscp.append("                if (rowNum > textFile.HeaderRowNum)\n");
    cscp.append("                { headerRowAndPrior = false; }\n");
    cscp.append("\n");
    cscp.append("                Output0Buffer.AddRow();\n");
    cscp.append("\n");
    cscp.append("                Output0Buffer.RowNum = rowNum;\n");
    cscp.append("                Output0Buffer.ListingID = textFile.ListingID;\n");
    cscp.append("                Output0Buffer.SheetName = textFile.ListingID.ToString();\n");
    cscp.append("                Output0Buffer.HeaderRowAndPrior = headerRowAndPrior;\n");
    cscp.append("                Output0Buffer.FileName = fileName;\n");
    cscp.append(TextBufferRows());
    cscp.append("\n");
    cscp.append("                rowNum++;\n");
    cscp.append("\n");
    cscp.append("            }\n");
    cscp.append("\n");
    cscp.append("        }\n");
    cscp.append("        catch (Exception ex)\n");
    cscp.append("        {\n");
    cscp.append("            throw new Exception(\"Error in PopulateTextBuffer method of ScriptSourceComponent. RowNum: \" + rowNum + \"; Message: \" + ex.Message);\n");
    cscp.append("        }\n");
    cscp.append("        finally\n");
    cscp.append("        {\n");
    cscp.append("            parser.Close();\n");
    cscp.append("        }\n");
    cscp.append("    }\n");
    //
    cscp.append("    private string GetTextBufferValue(string headerName, int indexNum, bool hasHeaders, ArrayList headerArray,\n");
    cscp.append("                               int numOfColumns, string[] columns)\n");
    cscp.append("    {\n");
    cscp.append("        string returnValue;\n");
    cscp.append("\n");
    cscp.append("        if (indexNum > columns.Length - 1)\n");
    cscp.append("        {\n");
    cscp.append("            returnValue = \"\";\n");
    cscp.append("        }\n");
    cscp.append("        else\n");
    cscp.append("        {\n");
    cscp.append("            returnValue = columns[GetColumnIndex(headerName, 0, hasHeaders, headerArray, numOfColumns)].ToString();\n");
    cscp.append("        }\n");
    cscp.append("\n");
    cscp.append("        return returnValue;\n");
    cscp.append("    }\n");
    cscp.append("    private int GetColumnIndex(string headerName, int indexNum, bool hasHeaders, ArrayList headerArray, int numOfColumns)\n");
    cscp.append("    {\n");
    cscp.append("        int holdIndex = -1;\n");
    cscp.append("\n");
    cscp.append("        if (hasHeaders)\n");
    cscp.append("        {\n");
    cscp.append("            holdIndex = headerArray.IndexOf(headerName.ToLower());\n");
    cscp.append("        }\n");
    cscp.append("        else\n");
    cscp.append("        {\n");
    cscp.append("            //if the sheet has less columns than the sheets with headers, then repeat the last column \n");
    cscp.append("            if (indexNum >= numOfColumns)\n");
    cscp.append("            {\n");
    cscp.append("              if (numOfColumns == 0)\n");
    cscp.append("              {\n");
    cscp.append("                  holdIndex = 0;\n");
    cscp.append("              }\n");
    cscp.append("              else\n");
    cscp.append("              {\n");
    cscp.append("                  holdIndex = numOfColumns - 1;\n");
    cscp.append("              }\n");
    cscp.append("            }\n");
    cscp.append("            else\n");
    cscp.append("            {\n");
    cscp.append("                holdIndex = indexNum;\n");
    cscp.append("            }\n");
    cscp.append("        }\n");
    cscp.append("\n");
    cscp.append("        return holdIndex;\n");
    cscp.append("    }\n");
    cscp.append("\n");
    // Source Headers
    cscp.append("    private void PopulateSourceHeaders(ArrayList sourceHeaders)\n");
    cscp.append("    {\n");
    cscp.append("        sourceHeaders.Clear();\n");
    cscp.append(ScriptSourceHeaders());
    cscp.append("    }\n");
    cscp.append("    private string GetFileName(string fqFileName)\n");
    cscp.append("    {\n");
    cscp.append("        string fileName = fqFileName.Substring(fqFileName.LastIndexOf(@\"\\\") + 1);\n");
    cscp.append("        return fileName;\n");
    cscp.append("    }\n");
    cscp.append("}\n");
    cscp.append("\n");
    cscp.append("public class ExcelFile\n");
    cscp.append("{\n");
    cscp.append("    public ExcelFile(string fqFileName, ArrayList sourceHeaders, string fileExtension, string tabularCalendar)\n");
    cscp.append("    {\n");
    cscp.append("        this.FqFileName = fqFileName;\n");
    cscp.append("        this.FileExtension = fileExtension;\n");
    cscp.append("        this.ConnectionString = GetConnectionString(this.fqFileName, this.FileExtension);\n");
    cscp.append("        SetExcelSheets(sourceHeaders, tabularCalendar);\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    string fqFileName;\n");
    cscp.append("\n");
    cscp.append("    public string FqFileName\n");
    cscp.append("    {\n");
    cscp.append("        get { return fqFileName; }\n");
    cscp.append("        set { fqFileName = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    string connectionString;\n");
    cscp.append("\n");
    cscp.append("    public string ConnectionString\n");
    cscp.append("    {\n");
    cscp.append("        get { return connectionString; }\n");
    cscp.append("        set { connectionString = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    string fileExtension;\n");
    cscp.append("\n");
    cscp.append("    public string FileExtension\n");
    cscp.append("    {\n");
    cscp.append("        get { return fileExtension; }\n");
    cscp.append("        set { fileExtension = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    ArrayList excelSheets;\n");
    cscp.append("\n");
    cscp.append("    public ArrayList ExcelSheets\n");
    cscp.append("    {\n");
    cscp.append("        get { return excelSheets; }\n");
    cscp.append("        set { excelSheets = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    private string GetConnectionString(string fqFileName, string fileExtension)\n");
    cscp.append("    {\n");
    cscp.append("        string connectionString = \"\";\n");
    cscp.append("\n");
    cscp.append("        try\n");
    cscp.append("        {\n");
    cscp.append("            switch (fileExtension)\n");
    cscp.append("            {\n");
    cscp.append("                case \"xlsx\":\n");
    cscp.append("                    connectionString = @\"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\"\n");
    cscp.append("                                     + fqFileName\n");
    cscp.append("                                     + \";Extended Properties='EXCEL 12.0 XML;HDR=NO;IMEX=1'\";\n");
    cscp.append("                    break;\n");
    cscp.append("                case \"xls\":\n");
    cscp.append("                    connectionString = @\"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=\"\n");
    cscp.append("                                 + fqFileName\n");
    cscp.append("                                 + @\";Extended Properties='Excel 8.0;HDR=NO;IMEX=1'\";\n");
    cscp.append("                    break;\n");
    cscp.append("                default:\n");
    cscp.append("                    throw new Exception(\"Error in GetConnectionString method switch statement of ExcelFile class. FileType not allowed.\");\n");
    cscp.append("            }\n");
    cscp.append("        }\n");
    cscp.append("        catch (Exception ex)\n");
    cscp.append("        {\n");
    cscp.append("            throw new Exception(\"Error in GetConnectionString Method of ExcelFile class. Message: \"\n");
    cscp.append("                                + ex.Message);\n");
    cscp.append("        }\n");
    cscp.append("\n");
    cscp.append("        return connectionString;\n");
    cscp.append("\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    private void SetExcelSheets(ArrayList sourceHeaders, string tabularCalendar)\n");
    cscp.append("    {\n");
    cscp.append("        OleDbConnection objConn = new OleDbConnection();\n");
    cscp.append("        System.Data.DataTable dt = null;\n");
    cscp.append("        this.ExcelSheets = new ArrayList();\n");
    cscp.append("        this.ExcelSheets.Clear();\n");
    cscp.append("        ExcelSheet excelSheet;\n");
    cscp.append("        string sheetName;\n");
    cscp.append("\n");
    cscp.append("        try\n");
    cscp.append("        {\n");
    cscp.append("            // Create connection object by using the preceding connection string.\n");
    cscp.append("            objConn = new OleDbConnection(this.ConnectionString);\n");
    cscp.append("            // Open connection with the database.\n");
    cscp.append("            objConn.Open();\n");
    cscp.append("            // Get the data table containg the schema guid.\n");
    cscp.append("            dt = objConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);\n");
    cscp.append("\n");
    cscp.append("            if (dt != null)\n");
    cscp.append("            {\n");
    cscp.append("\n");
    cscp.append("                //String[] excelSheets = new String[dt.Rows.Count];\n");
    cscp.append("\n");
    cscp.append("                // Add the sheet name to the string array.\n");
    cscp.append("                foreach (DataRow row in dt.Rows)\n");
    cscp.append("                {\n");
    cscp.append("                    sheetName = row[\"TABLE_NAME\"].ToString();\n");
    cscp.append("                    excelSheet = new ExcelSheet(sheetName, this, sourceHeaders, tabularCalendar);\n");
    cscp.append("                    if (excelSheet.IsValidExcelSheet())\n");
    cscp.append("                    { this.ExcelSheets.Add(excelSheet); }\n");
    cscp.append("                }\n");
    cscp.append("            }\n");
    cscp.append("        }\n");
    cscp.append("        catch (Exception ex)\n");
    cscp.append("        {\n");
    cscp.append("            throw new Exception(\"Error in SetExcelSheets method of ExcelFile class.  Message: \" + ex.Message);\n");
    cscp.append("        }\n");
    cscp.append("        finally\n");
    cscp.append("        {\n");
    cscp.append("            // Clean up.\n");
    cscp.append("            if (objConn != null)\n");
    cscp.append("            {\n");
    cscp.append("                objConn.Close();\n");
    cscp.append("                objConn.Dispose();\n");
    cscp.append("            }\n");
    cscp.append("            if (dt != null)\n");
    cscp.append("            {\n");
    cscp.append("                dt.Dispose();\n");
    cscp.append("            }\n");
    cscp.append("        }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("}\n");
    cscp.append("\n");
    cscp.append("public class ExcelSheet\n");
    cscp.append("{\n");
    cscp.append("\n");
    cscp.append("    public ExcelSheet(string sheetName, ExcelFile excelFile, ArrayList sourceHeaders, string tabularCalendar)\n");
    cscp.append("    {\n");
    cscp.append("        this.HeaderArray = new ArrayList();\n");
    cscp.append("        this.SheetName = sheetName;\n");
    cscp.append("\n");
    cscp.append("        OleDbDataReader dr;\n");
    cscp.append("\n");
    cscp.append("        OleDbConnection conn = new OleDbConnection(excelFile.ConnectionString);\n");
    cscp.append("        string cmdString = \"select * from [\" + this.SheetName + \"]\";\n");
    cscp.append("        OleDbCommand cmd = new OleDbCommand(cmdString, conn);\n");
    cscp.append("        int rowNum = 1;\n");
    cscp.append("        bool isHeaderRow = false;\n");
    cscp.append("        this.HeaderRowNum = -1;\n");
    cscp.append("        bool columnIsHeader = false;\n");
    cscp.append("        string colName = \"\";\n");
    cscp.append("        this.HasHeaders = false;\n");
    cscp.append("        string newLineChars = \"\\n\";\n");
    cscp.append("\n");
    cscp.append("        try\n");
    cscp.append("        {\n");
    cscp.append("            if (this.IsValidExcelSheet())\n");
    cscp.append("            {\n");
    cscp.append("                conn.Open();\n");
    cscp.append("                dr = cmd.ExecuteReader();\n");
    cscp.append("\n");
    cscp.append("                while (!tabularCalendar.Equals(\"Calendar\") &amp; dr.Read())\n");
    cscp.append("                {\n");
    cscp.append("                    isHeaderRow = true;\n");
    cscp.append("                    foreach (string sourceHeader in sourceHeaders)\n");
    cscp.append("                    {\n");
    cscp.append("                        columnIsHeader = false;\n");
    cscp.append("                        for (int colNum = 0; colNum &lt; dr.FieldCount; colNum++)\n");
    cscp.append("                        {\n");
    cscp.append("                            colName = dr[colNum].ToString().ToLower();\n");
    cscp.append("                            colName = colName.Replace(newLineChars, \" \").Replace(Environment.NewLine, \" \");\n");
    cscp.append("                            if (sourceHeader.ToLower().Equals(colName))\n");
    cscp.append("                            {\n");
    cscp.append("                                columnIsHeader = true;\n");
    cscp.append("                                break;  // no need to check further, this row does not contain all headers.\n");
    cscp.append("                                //break the for loop\n");
    cscp.append("                            }\n");
    cscp.append("                        }\n");
    cscp.append("\n");
    cscp.append("                        if (!columnIsHeader)\n");
    cscp.append("                        {\n");
    cscp.append("                            isHeaderRow = false;\n");
    cscp.append("                            break;  // break the foreach.  all headers must be in spreadsheet\n");
    cscp.append("                        }\n");
    cscp.append("                    }\n");
    cscp.append("\n");
    cscp.append("                    if (isHeaderRow)\n");
    cscp.append("                    {\n");
    cscp.append("                        for (int colNum = 0; colNum &lt; dr.FieldCount; colNum++)\n");
    cscp.append("                        {\n");
    cscp.append("                            headerArray.Add(dr[colNum].ToString().ToLower().Replace(newLineChars, \" \").Replace(Environment.NewLine, \" \"));\n");
    cscp.append("                        }\n");
    cscp.append("\n");
    cscp.append("                        this.HeaderRowNum = rowNum;\n");
    cscp.append("                        this.HasHeaders = true;\n");
    cscp.append("\n");
    cscp.append("                        break; //break the while loop\n");
    cscp.append("                        //no need to read further, headerArray has been populated\n");
    cscp.append("                    }\n");
    cscp.append("\n");
    cscp.append("                    rowNum++;\n");
    cscp.append("                }\n");
    cscp.append("\n");
    cscp.append("                this.NumOfColumns = dr.FieldCount;\n");
    cscp.append("\n");
    cscp.append("                dr.Close();\n");
    /*cscp.append("                if (tabularCalendar.Equals(\"Tabular_Header\") &amp; \n");
    cscp.append("                this.HasHeaders == false)\n");
    cscp.append("                {\n");
    cscp.append("                    throw new Exception(\"Error in ExcelSheet constructor of ScriptSourceComponent. The map is listed as a Tabular_Header file type but \" +\n");
    cscp.append("                                    \"were not detected in the file\");\n");
    cscp.append("                }\n");*/
    cscp.append("            }\n");
    cscp.append("        }\n");
    cscp.append("        catch (Exception ex)\n");
    cscp.append("        {\n");
    cscp.append("            throw new Exception(\"Error in ExcelSheet constructor of ScriptSourceComponent. Message: \" + ex.Message);\n");
    cscp.append("        }\n");
    cscp.append("        finally\n");
    cscp.append("        {\n");
    cscp.append("            conn.Close();\n");
    cscp.append("        }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    string sheetName;\n");
    cscp.append("\n");
    cscp.append("    public string SheetName\n");
    cscp.append("    {\n");
    cscp.append("        get { return sheetName; }\n");
    cscp.append("        set { sheetName = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    bool hasHeaders;\n");
    cscp.append("\n");
    cscp.append("    public bool HasHeaders\n");
    cscp.append("    {\n");
    cscp.append("      get { return hasHeaders; }\n");
    cscp.append("      set { hasHeaders = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    int numOfColumns;\n");
    cscp.append("\n");
    cscp.append("    public int NumOfColumns\n");
    cscp.append("    {\n");
    cscp.append("      get { return numOfColumns; }\n");
    cscp.append("      set { numOfColumns = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    private int headerRowNum;\n");
    cscp.append("\n");
    cscp.append("    public int HeaderRowNum\n");
    cscp.append("    {\n");
    cscp.append("        get { return headerRowNum; }\n");
    cscp.append("        set { headerRowNum = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    ArrayList headerArray;\n");
    cscp.append("\n");
    cscp.append("    public ArrayList HeaderArray\n");
    cscp.append("    {\n");
    cscp.append("      get { return headerArray; }\n");
    cscp.append("      set { headerArray = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    public bool IsValidExcelSheet()\n");
    cscp.append("    {\n");
    cscp.append("        bool sheetIsValid = false;\n");
    cscp.append("        string sheetName = this.SheetName;\n");
    cscp.append("        string lastChar = this.SheetName.Substring(this.SheetName.Length - 1, 1);\n");
    cscp.append("        string last2Char = this.SheetName.Substring(this.SheetName.Length - 2, 2);\n");
    cscp.append("\n");
    cscp.append("        //only process sheets that have a $ as the last character or if it is delimited by ', then it has $' as the last two\n");
    cscp.append("        if (lastChar.Equals(\"$\") ||\n");
    cscp.append("            last2Char.Equals(\"$'\"))\n");
    cscp.append("        {\n");
    cscp.append("            sheetIsValid = true; \n");
    cscp.append("        }\n");
    cscp.append("\n");
    cscp.append("        return sheetIsValid;\n");
    cscp.append("    }\n");
    cscp.append("}\n");
    cscp.append("    public class TextFile\n");
    cscp.append("{\n");
    cscp.append("    public TextFile(ArrayList sourceHeaders, string fqFileName, string tabularCalendar, string fileExtension)\n");
    cscp.append("    {\n");
    cscp.append("        this.HeaderArray = new ArrayList();\n");
    cscp.append("        this.FqFileName = fqFileName;\n");
    cscp.append("        this.FileExtension = fileExtension;\n");
    cscp.append("\n");
    cscp.append("        int rowNum = 1;\n");
    cscp.append("        bool isHeaderRow = false;\n");
    cscp.append("        this.HeaderRowNum = -1;\n");
    cscp.append("        bool columnIsHeader = false;\n");
    cscp.append("        string colName = \"\";\n");
    cscp.append("        this.HasHeaders = false;\n");
    cscp.append("        string newLineChars = \"\\n\";\n");
    cscp.append("\n");
    cscp.append("        try\n");
    cscp.append("        {\n");
    cscp.append("\n");
    cscp.append("            TextFieldParser parser = new TextFieldParser(this.FqFileName);\n");
    cscp.append("\n");
    cscp.append("            if (this.FileExtension.Equals(\"csv\"))\n");
    cscp.append("            {\n");
    cscp.append("                parser.HasFieldsEnclosedInQuotes = true;\n");
    cscp.append("                parser.SetDelimiters(\",\");\n");
    cscp.append("            }\n");
    cscp.append("            else\n");
    cscp.append("            {\n");
    cscp.append("                parser.HasFieldsEnclosedInQuotes = true;\n");
    cscp.append("                parser.SetDelimiters(\"\\t\");\n");
    cscp.append("            }\n");
    cscp.append("\n");
    cscp.append("            string[] columns;\n");
    cscp.append("            \n");
    cscp.append("            while (!parser.EndOfData)\n");
    cscp.append("            {\n");
    cscp.append("                isHeaderRow = true;\n");
    cscp.append("                columns = parser.ReadFields();\n");
    cscp.append("\n");
    cscp.append("                foreach (string sourceHeader in sourceHeaders)\n");
    cscp.append("                {\n");
    cscp.append("                    columnIsHeader = false;\n");
    cscp.append("\n");
    cscp.append("                    foreach (string column in columns)\n");
    cscp.append("                    {\n");
    cscp.append("                        colName = column.ToString().ToLower();\n");
    cscp.append("                        colName = colName.Replace(newLineChars, \" \").Replace(Environment.NewLine, \" \");\n");
    cscp.append("                        if (sourceHeader.ToLower().Equals(colName))\n");
    cscp.append("                        {\n");
    cscp.append("                            columnIsHeader = true;\n");
    cscp.append("                            break;  // no need to check further, column is a header. break the for loop\n");
    cscp.append("                        }\n");
    cscp.append("                    }\n");
    cscp.append("\n");
    cscp.append("                    if (!columnIsHeader)\n");
    cscp.append("                    {\n");
    cscp.append("                        isHeaderRow = false;\n");
    cscp.append("                        break;  // break the foreach.  all headers must be in spreadsheet\n");
    cscp.append("                    }\n");
    cscp.append("                }\n");
    cscp.append("\n");
    cscp.append("                if (isHeaderRow)\n");
    cscp.append("                {\n");
    cscp.append("                    foreach (string column in columns)\n");
    cscp.append("                    {\n");
    cscp.append("                        headerArray.Add(column.ToString().ToLower());\n");
    cscp.append("                    }\n");
    cscp.append("\n");
    cscp.append("                    this.HeaderRowNum = rowNum;\n");
    cscp.append("                    this.HasHeaders = true;\n");
    cscp.append("                    this.NumOfColumns = columns.Length;\n");
    cscp.append("\n");
    cscp.append("                    break; //break the while loop\n");
    cscp.append("                    //no need to read further, headerArray has been populated\n");
    cscp.append("                }\n");
    cscp.append("\n");
    cscp.append("                rowNum++;\n");
    cscp.append("            }\n");
    cscp.append("\n");
    cscp.append("            parser.Close();\n");
    cscp.append("\n");
    cscp.append("            if (tabularCalendar.Equals(\"Tabular_Header\") &amp;\n");
    cscp.append("                this.HasHeaders == false)\n");
    cscp.append("            {\n");
    cscp.append("                throw new Exception(\"Error in TextFile constructor of ScriptSourceComponent. The map is listed as a Tabular_Header file type but \" +\n");
    cscp.append("                                    \"headers were not detected in the file\");\n");
    cscp.append("            }\n");
    cscp.append("        }\n");
    cscp.append("        catch (Exception ex)\n");
    cscp.append("        {\n");
    cscp.append("            throw new Exception(\"Error in TextFile constructor of ScriptSourceComponent. Message: \" + ex.Message);\n");
    cscp.append("        }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    string fqFileName;\n");
    cscp.append("\n");
    cscp.append("    public string FqFileName\n");
    cscp.append("    {\n");
    cscp.append("        get { return fqFileName; }\n");
    cscp.append("        set { fqFileName = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    string fileExtension;\n");
    cscp.append("\n");
    cscp.append("    public string FileExtension\n");
    cscp.append("    {\n");
    cscp.append("        get { return fileExtension; }\n");
    cscp.append("        set { fileExtension = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    int listingID;\n");
    cscp.append("\n");
    cscp.append("    public int ListingID\n");
    cscp.append("    {\n");
    cscp.append("        get { return listingID; }\n");
    cscp.append("        set { listingID = value; }\n");
    cscp.append("    } \n");
    cscp.append("\n");
    cscp.append("    bool hasHeaders;\n");
    cscp.append("\n");
    cscp.append("    public bool HasHeaders\n");
    cscp.append("    {\n");
    cscp.append("        get { return hasHeaders; }\n");
    cscp.append("        set { hasHeaders = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    int numOfColumns;\n");
    cscp.append("\n");
    cscp.append("    public int NumOfColumns\n");
    cscp.append("    {\n");
    cscp.append("        get { return numOfColumns; }\n");
    cscp.append("        set { numOfColumns = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    private int headerRowNum;\n");
    cscp.append("\n");
    cscp.append("    public int HeaderRowNum\n");
    cscp.append("    {\n");
    cscp.append("        get { return headerRowNum; }\n");
    cscp.append("        set { headerRowNum = value; }\n");
    cscp.append("    }\n");
    cscp.append("\n");
    cscp.append("    ArrayList headerArray;\n");
    cscp.append("\n");
    cscp.append("    public ArrayList HeaderArray\n");
    cscp.append("    {\n");
    cscp.append("        get { return headerArray; }\n");
    cscp.append("        set { headerArray = value; }\n");
    cscp.append("    }\n");
    cscp.append("}\n");
    cscp.append("                </File>\n");
    cscp.append("            </Files>\n");
    cscp.append("            <ReadOnlyVariables>\n");
    cscp.append("                <Variable Namespace=\"User\" DataType=\"String\" VariableName=\"FQFileName\" />\n");
    cscp.append("                <Variable Namespace=\"User\" DataType=\"Int64\" VariableName=\"ListingID\" />\n");
    cscp.append("                <Variable Namespace=\"User\" DataType=\"String\" VariableName=\"TabularCalendar\" />\n");
    cscp.append("            </ReadOnlyVariables>\n");
    cscp.append("        </ScriptComponentProject>\n");
    cscp.append("    </ScriptProjects>\n");
    return cscp;
}

function CreatePackageHeader() {
    var cp = new java.lang.StringBuffer();
    var mapId = MAPPING.getMappingInfo().getMappingId();
    var mappingName = mapping.getMappingInfo().getMappingName();
    cp.append("    <Packages>\n");
    cp.append("        <Package Name=\"" + mappingName + "\" ForcedExecutionValueDataType=\"Empty\" Language=\"None\" ConstraintMode=\"Linear\" ProtectionLevel=\"EncryptSensitiveWithUserKey\" SsisPackageType=\"5\" VersionMajor=\"1\" VersionBuild=\"16\" CreatorName=\"MP36CWZ\Paul\" CreatorComputerName=\"MP36CWZ\" CreationDate=\"2014-01-30T18:38:47\">\n");
    cp.append("            <Connections>\n");
    cp.append("                    <Connection ConnectionName=\"IngestAutomationStage\" />\n");
    cp.append("                    <Connection ConnectionName=\"IngestAutomationUtil\" />\n");
    cp.append("            </Connections>\n");
    cp.append("            <Variables>\n");
    var projectId = "";
    var projectDAO = new com.icc.resourcemanager.dao.ProjectDao();
    var projects = projectDAO.getAllProjectsList();
    var plen = projects.size();
    var str = "";
        for(var j=plen-1; j>=0; j--)
        {
            str = projects.get(j).getProjName();
            if (str.equals("Ingest Automation")) {
                projectId = projects.get(j).getProjId();
            }
        }
    var mappingDao = new com.icc.mappingmanager.dao.MappingDao();
    var mappingVo = mappingDao.getMapDetails(projectId, mapId);
    cp.append("                <Variable Name=\"FQFileName\" DataType=\"String\">" + mappingVo.getUserDefinedNotes1() + "</Variable>\n");
    cp.append("                <Variable Name=\"ListingID\" DataType=\"Int64\">0</Variable>\n");
    cp.append("                <Variable Name=\"TabularCalendar\" DataType=\"String\">" + mappingVo.getUserDefinedNotes4() + "</Variable>\n");
    cp.append("                <Variable Name=\"StageConnection\" DataType=\"String\">Data Source=tul1dsiaqdb01;Initial Catalog=IngestAutomationStage;Provider=SQLNCLI11.1;Integrated Security=SSPI;Auto Translate=False;</Variable>\n");
    cp.append("                <Variable Name=\"UtilConnection\" DataType=\"String\">Data Source=tul1dsiaqdb01;Initial Catalog=IngestAutomationUtils;Provider=SQLNCLI11.1;Integrated Security=SSPI;Auto Translate=False;</Variable>\n");
    cp.append("            </Variables>\n");
    cp.append("            <Tasks>\n");
    return cp;
}

function TruncateUtilityTable() {
    var tut = new java.lang.StringBuffer();
    var tfrms =  mapping.getTransformations();
    var sourceTableName = tfrms.get(0).getInputColumns().get(0).getParentTable().getCompleteName();
    var mapId = MAPPING.getMappingInfo().getMappingId();
    var storedProcsString = "";
    var projectId = "";
    var projectDAO = new com.icc.resourcemanager.dao.ProjectDao();
    var projects = projectDAO.getAllProjectsList();
    var plen = projects.size();
    var str = "";
        for(var j=plen-1; j>=0; j--)
        {
            str = projects.get(j).getProjName();
            if (str.equals("Ingest Automation")) {
                projectId = projects.get(j).getProjId();
            }
        }
    var mappingDao = new com.icc.mappingmanager.dao.MappingDao();
    var mappingVo = mappingDao.getMapDetails(projectId, mapId);
    if (mappingVo.getUserDefinedNotes4().equals("Calendar")) {
        tut.append("                <ExecuteSQL Name=\"TruncateUtil\" ConnectionName=\"IngestAutomationUtil\">\n");
        tut.append("                    <DirectInput>\n");
        tut.append("                        truncate table [util].[" + sourceTableName + "];\n");
        tut.append("                    </DirectInput>\n");
        tut.append("                </ExecuteSQL>\n");
        tut.append("                <ExecuteSQL Name=\"TruncateTemp\" ConnectionName=\"IngestAutomationUtil\">\n");
        tut.append("                    <DirectInput>\n");
        tut.append("                        truncate table [temp].[" + sourceTableName + "];\n");
        tut.append("                    </DirectInput>\n");
        tut.append("                </ExecuteSQL>\n");
    }
    else {
        tut.append("                <ExecuteSQL Name=\"TruncateUtil\" ConnectionName=\"IngestAutomationUtil\">\n");
        tut.append("                    <DirectInput>\n");
        tut.append("                        truncate table [util].[" + sourceTableName + "];\n");
        tut.append("                    </DirectInput>\n");
        tut.append("                </ExecuteSQL>\n");
    }
    return tut;
}

function CreateSourceExtractDataflow() {
    var csed = new java.lang.StringBuffer();
    var tfrms =  mapping.getTransformations();
    var sourceTableName = tfrms.get(0).getInputColumns().get(0).getParentTable().getCompleteName();
    csed.append("                <Dataflow Name=\"SourceExtractDataflow\" DefaultBufferSize=\"104857600\">\n");
    csed.append("                    <Transformations>\n");
    csed.append("                        <ScriptComponentSource ProjectCoreName=\"SC_eb1debcd2374468ebccbbfad4fbe5976\" Name=\"ScriptComponentSource\">\n");
    csed.append("                            <ScriptComponentProjectReference ScriptComponentProjectName=\"SourceExtractScript\" />\n");
    csed.append("                        </ScriptComponentSource>\n");
    csed.append(SourceExtractDestination());
    csed.append("                    </Transformations>\n");
    csed.append("                </Dataflow>\n");
    return csed;
}

function CreateStoredProcTasks() {
    var cspt = new java.lang.StringBuffer();
    var mapId = MAPPING.getMappingInfo().getMappingId();
    var storedProcsString = "";
    var projectId = "";
    var projectDAO = new com.icc.resourcemanager.dao.ProjectDao();
    var projects = projectDAO.getAllProjectsList();
    var plen = projects.size();
    var str = "";
        for(var j=plen-1; j>=0; j--)
        {
            str = projects.get(j).getProjName();
            if (str.equals("Ingest Automation")) {
                projectId = projects.get(j).getProjId();
            }
        }
    var mappingDao = new com.icc.mappingmanager.dao.MappingDao();
    var mappingVo = mappingDao.getMapDetails(projectId, mapId);
    storedProcsString = mappingVo.getUserDefinedNotes3();
    var storedProcs = storedProcsString.split(";");
    for( var i=0;i<storedProcs.length;i++) {
        if (!mappingVo.getUserDefinedNotes3().equals("")) {
        cspt.append("                <ExecuteSQL Name=\"ExecSP" + (i + 1) + "\" ConnectionName=\"IngestAutomationUtil\">\n");
        cspt.append("                    <DirectInput>\n");
        cspt.append("                        exec " + storedProcs[i] + ";\n");
        cspt.append("                    </DirectInput>\n");
        cspt.append("                </ExecuteSQL>\n");
        }
    }
    return cspt;
}

function CreateValidationTask() {
    var cvt = new java.lang.StringBuffer();
    var tfrms =  mapping.getTransformations();
    var sourceTableName = tfrms.get(0).getInputColumns().get(0).getParentTable().getCompleteName();
    var targetTableName = tfrms.get(0).getOutputColumns().get(0).getParentTable().getCompleteName();
        cvt.append("                <ExecuteSQL Name=\"ValidationTask\" ConnectionName=\"IngestAutomationUtil\">\n");
        cvt.append("                    <DirectInput>\n");
        cvt.append("                        SELECT \n");
        for (var i=0;i<tfrms.size();i++) {
            var sourceColumnName = "";
            if (tfrms.get(i).getInputColumns().size()>0) {
                sourceColumnName = tfrms.get(i).getInputColumns().get(0).getColumnName();
            }
            var targetColumnName = tfrms.get(i).getOutputColumns().get(0).getColumnName();
            var dataType = tfrms.get(i).getOutputColumns().get(0).getDataType();
            var dataLength = tfrms.get(i).getOutputColumns().get(0).getLength();
            var dataPrecision = tfrms.get(i).getOutputColumns().get(0).getPrecision();
            var dataScale = tfrms.get(i).getOutputColumns().get(0).getScale();
            var completedSourceColumn = "";
                if (!sourceColumnName.toLowerCase().equals("dummy")) {
                    if (!tfrms.get(i).getBussinessRule().equals("")) {
                        completedSourceColumn = ConvertDataType (tfrms.get(i).getBussinessRule(), dataType, dataLength, dataPrecision, dataScale, "function");
                    }
                    else {
                        completedSourceColumn = ConvertDataType (sourceColumnName, dataType, dataLength, dataPrecision, dataScale, "column");
                    }
                    cvt.append("                        " + completedSourceColumn + ",\n");
                }
                else {
                    if (!tfrms.get(i).getBussinessRule().equals("")) {
                        completedSourceColumn = ConvertDataType (tfrms.get(i).getBussinessRule(), dataType, dataLength, dataPrecision, dataScale, "function");
                        cvt.append("                        " + completedSourceColumn + ",\n");
                    }
                }
        }
        cvt.deleteCharAt(cvt.length()-2);
        cvt.append("                        From util.[" + sourceTableName + "];\n");
        cvt.append("DECLARE \n");
        cvt.append(" \n");
        cvt.append(" @ERR_MSG AS NVARCHAR(4000)\n");
        cvt.append(" ,@ERR_SEV AS SMALLINT\n");
        cvt.append(" ,@ERR_STA AS SMALLINT\n");
        cvt.append(" ,@rowcount int\n");
        cvt.append(" \n");
        cvt.append("BEGIN TRY\n");
        cvt.append(" SELECT @rowcount = COUNT(*) From util.[" + sourceTableName + "] \n");
        cvt.append(" if @rowcount = 0\n");
        cvt.append("     Select 1/0 as DivideByZero\n");
        cvt.append("END TRY\n");
        cvt.append("BEGIN CATCH\n");
        cvt.append(" SELECT @ERR_MSG = ERROR_MESSAGE(),\n");
        cvt.append(" @ERR_SEV =ERROR_SEVERITY(),\n");
        cvt.append(" @ERR_STA = ERROR_STATE()\n");
        cvt.append(" SET @ERR_MSG= 'There are no rows in the Util Table for processing '\n");
        cvt.append(" \n");
        cvt.append(" RAISERROR (@ERR_MSG, @ERR_SEV, @ERR_STA) WITH NOWAIT\n");
        cvt.append("END CATCH\n");
        cvt.append("GO\n");
        //add stored procedure validation for all stored procs referred in the map
        var r = [];
        for (var i=0;i<tfrms.size();i++) {
            if(!tfrms.get(i).getUserDefined1().equals(""))
               r[i] = tfrms.get(i).getUserDefined1();
        }
        var uniqueR = RemoveDuplicates(r);
        for (var i=0;i<uniqueR.length;i++) {
            cvt.append("                            Exec " + uniqueR[i] + "\n");
        }
        cvt.append("                    </DirectInput>\n");
        cvt.append("                </ExecuteSQL>\n");
    return cvt;
}

function RemoveDuplicates(arr) {
    var uniqueNames = [];
    arr.sort();
    var lastItem = "";
    for(var i=0; i<arr.length; i++){
        if(!arr[i]==("") && arr[i].toLowerCase().trim() != lastItem.toLowerCase().trim())
            uniqueNames.push(arr[i].trim());
        lastItem = arr[i];
    }
    return uniqueNames;
}

function CreateTargetDataflows() {
    var ctd = new java.lang.StringBuffer();
    var mapping = MAPPING;
    var mapInfo = mapping.getMappingInfo();
    var tfrms =  mapping.getTransformations();
    var sourceTableName = tfrms.get(0).getInputColumns().get(0).getParentTable().getCompleteName();
    var targetTableName = "";
    var holdTargetTableName = "";
    var targetTableNames = getTargetTableNames();
    for (k=0; k < targetTableNames.length; k++) {
        targetTableName = targetTableNames[k];
        var rowCount = GetSourceColumnCountforTargetTable(targetTableName);
        if (rowCount!=0) {
            ctd.append("                <Dataflow Name=\"Load" + RemoveCharacter(targetTableName) +"\" ForcedExecutionValueDataType=\"Empty\">\n");
            ctd.append("                    <Transformations>\n");
            ctd.append(CreateSourceComponent(sourceTableName, targetTableName));
            ctd.append(CreateLookUpComponents(sourceTableName, targetTableName));
            ctd.append(CreateTargetComponent(sourceTableName, targetTableName));
            ctd.append("                    </Transformations>\n");
            ctd.append("                </Dataflow>\n");
        }
    }
    return ctd;
}

function CreatePackageFooter() {
    var cpf = new java.lang.StringBuffer();
    cpf.append("            </Tasks>\n");
    cpf.append("        </Package>\n");
    cpf.append("    </Packages>\n");
    return cpf;
}

function CreateFooter() {
    var cf = new java.lang.StringBuffer();
    cf.append("</Biml>");
    return cf;
}

function getTargetTableNames() {
    var targetTableName = "";
    var holdTargetTableName = "";
    var targetTableNames = [];
    var tfrms =  mapping.getTransformations();
    var x=0;
    for (k=0; k < tfrms.size(); k++) {
        targetTableName = tfrms.get(k).getOutputColumns().get(0).getParentTable().getCompleteName();
        if (!targetTableName.equals(holdTargetTableName)) {
            holdTargetTableName = targetTableName;
            targetTableNames[x] = targetTableName;
            x++;
        }
    }
    return targetTableNames;
}

function GetSourceColumnCountforTargetTable(targetTableName) {
    var tfrms =  mapping.getTransformations();
    var rowCount = 0;
    for (var i=0;i<tfrms.size();i++) {
        var sourceColumnName = "";
        if (tfrms.get(i).getInputColumns().size()>0) {
            sourceColumnName = tfrms.get(i).getInputColumns().get(0).getColumnName();
        }
        if(tfrms.get(i).getOutputColumns().get(0).getParentTable().getCompleteName().equals(targetTableName) && !sourceColumnName.equals("")) {
            rowCount++;
        }
    }
    return rowCount;
}

function ConvertDataType (columnName, dataType, dataLength, dataPrecision, dataScale, inputType) {
    var convertedColumn = "";
    //var inpType = inputType;
    //Handle DataTypes with no length scale or precision;
        if (dataType.toLowerCase().equals("datetime") || 
            dataType.toLowerCase().equals("date") || 
            dataType.toLowerCase().equals("int") ||
            dataType.toLowerCase().equals("smallint") ||
            dataType.toLowerCase().equals("tinyint") ||
            dataType.toLowerCase().equals("bit")) {
        if (inputType=="column") {
            convertedColumn = "Convert(" + dataType + ", [" + columnName + "])";
        }
        else {
            convertedColumn = "Convert(" + dataType + ", " + columnName + ")";
        }
    }
    //Handle DataTypes with length only;
    else if (dataType.toLowerCase().equals("varchar") || 
             dataType.toLowerCase().equals("nvarchar") ||
             dataType.toLowerCase().equals("nchar") ||
             dataType.toLowerCase().equals("char")) {
        if (inputType=="column") {
            convertedColumn = "Convert(" + dataType + "(" + dataLength + "), [" + columnName + "])";
        }
        else {
            convertedColumn = "Convert(" + dataType + "(" + dataLength + "), " + columnName + ")";
        }
    }
    // Handle DataTypes with scale and precision;
    else if (dataType.toLowerCase().equals("numeric") || 
             dataType.toLowerCase().equals("decimal")) {
        if (inputType=="column") {
            convertedColumn = "Convert(" + dataType + "(" + dataPrecision + ", " + dataScale + "),[" + columnName + "])";
        }
        else {
            convertedColumn = "Convert(" + dataType + "(" + dataPrecision + ", " + dataScale + ")," + columnName + ")";
        }
    }
    return convertedColumn;
}

function CreateSourceComponent(sourceTableName, targetTableName) {
    var csc = new java.lang.StringBuffer();
    var tfrms =  mapping.getTransformations();
    var storedProcSource = false;
        csc.append("                        <OleDbSource Name=\"" + RemoveCharacter(sourceTableName) + "\" LocaleId=\"None\" DefaultCodePage=\"1252\" ConnectionName=\"IngestAutomationUtil\">\n");
        csc.append("                            <DirectInput>\n");
        for (var i=0;i<tfrms.size();i++) {
            var sourceColumnName = "";
            if (tfrms.get(i).getInputColumns().size()>0) {
                sourceColumnName = tfrms.get(i).getInputColumns().get(0).getColumnName();
            }
            if (tfrms.get(i).getOutputColumns().get(0).getParentTable().getCompleteName().equals(targetTableName) 
                && !sourceColumnName.equals("") 
                && !tfrms.get(i).getUserDefined1().equals("")) {
                storedProcSource = true;
            }
        }
        if (storedProcSource==true) {
            for (var i=0;i<tfrms.size();i++) {
                if (tfrms.get(i).getOutputColumns().get(0).getParentTable().getCompleteName().equals(targetTableName)) {
                    csc.append("                            Exec " + tfrms.get(i).getUserDefined1() + "\n");
                    break;
                }
            }
        }
        else {
            csc.append("                            SELECT \n");
            csc.append("                            [ListingId] as roviListingsId,\n");
            csc.append("                            [UtilKey],\n");
            for (var i=0;i<tfrms.size();i++) {
                var targetColumnName = tfrms.get(i).getOutputColumns().get(0).getColumnName();
                var sourceColumnName = "";
                if (tfrms.get(i).getInputColumns().size()>0) {
                    sourceColumnName = tfrms.get(i).getInputColumns().get(0).getColumnName();
                }
                var dataType = tfrms.get(i).getOutputColumns().get(0).getDataType();
                var dataLength = tfrms.get(i).getOutputColumns().get(0).getLength();
                var dataPrecision = tfrms.get(i).getOutputColumns().get(0).getPrecision();
                var dataScale = tfrms.get(i).getOutputColumns().get(0).getScale();
                var completedSourceColumn = "";
                if (tfrms.get(i).getOutputColumns().get(0).getParentTable().getCompleteName().equals(targetTableName) 
                    && !sourceColumnName.equals("")) {
                    if (!tfrms.get(i).getBussinessRule().equals("")) {
                        completedSourceColumn = ConvertDataType (tfrms.get(i).getBussinessRule(), dataType, dataLength, dataPrecision, dataScale, "function");
                    }
                    else {
                        completedSourceColumn = ConvertDataType (sourceColumnName, dataType, dataLength, dataPrecision, dataScale, "column");
                    }
                    csc.append("                            " + completedSourceColumn + " as [" + targetColumnName + "],\n");
                }
            }
            csc.deleteCharAt(csc.length()-2);
            csc.append("                            From util.[" + sourceTableName + "]\n");
        }
        csc.append("                            </DirectInput>\n");
        csc.append("                        </OleDbSource>\n");
    return csc;
}

function CreateTargetComponent(sourceTableName, targetTableName) {
    var ctc = new java.lang.StringBuffer();
    var tfrms =  mapping.getTransformations();
    var lookupFlag = false;
        ctc.append("                        <OleDbDestination Name=\"" + RemoveCharacter(targetTableName) + "\" ConnectionName=\"IngestAutomationStage\" UseFastLoadIfAvailable=\"false\" MaximumInsertCommitSize=\"2147483647\" DefaultCodePage=\"1252\" FastLoadOptions=\"\">\n");
    for (var i=0;i<tfrms.size();i++)  {
        var sourceColumnName = "";
        if (tfrms.get(i).getInputColumns().size()>0) {
            sourceColumnName = tfrms.get(i).getInputColumns().get(0).getColumnName();
        }
        if (tfrms.get(i).getOutputColumns().get(0).getParentTable().getCompleteName().equals(targetTableName) && 
           !sourceColumnName.equals("") && 
           !tfrms.get(i).getTransLookupCondition().equals("")) {
           lookupFlag = true;
        }
    }
        if (lookupFlag==false) {
        ctc.append("                            <DataflowOverrides>\n");
        ctc.append("                                <InputPath InputPathName=\"OLE DB Destination Input\" ErrorOrTruncationOperation=\"Insert\" />\n");
        ctc.append("                            </DataflowOverrides>\n");
        ctc.append("                            <InputPath OutputPathName=\"" + RemoveCharacter(sourceTableName) + ".Output\" SsisName=\"OLE DB Destination Input\" />\n"); // Input Path for Direct input from Source Component //SsisName=\"OLE DB Destination Input\" 
        }
        
        ctc.append("                            <ExternalTableOutput Table=\"[" + targetTableName.replace("dbo.","dbo].[") + "]\" />\n");
        ctc.append("                            <Columns>\n");
        for (var i=0;i<tfrms.size();i++) {
            var targetColumnName = tfrms.get(i).getOutputColumns().get(0).getColumnName();
            var sourceColumnName = "";
            if (tfrms.get(i).getInputColumns().size()>0) {
                sourceColumnName = tfrms.get(i).getInputColumns().get(0).getColumnName();
            }
            if(tfrms.get(i).getOutputColumns().get(0).getParentTable().getCompleteName().equals(targetTableName) && !sourceColumnName.equals("")) {
                ctc.append("                                <Column SourceColumn=\"[" + targetColumnName + "]\" TargetColumn=\"[" + targetColumnName + "]\" />\n");
            }
        }
        ctc.append("                            </Columns>\n");
        ctc.append("                        </OleDbDestination>\n");
    return ctc;
}

function CreateLookUpComponents(sourceTableName, targetTableName) {
    var clc = new java.lang.StringBuffer();
    var tfrms =  mapping.getTransformations();
    for (var i=0;i<tfrms.size();i++)  {
        var sourceColumnName = "";
        if (tfrms.get(i).getInputColumns().size()>0) {
            sourceColumnName = tfrms.get(i).getInputColumns().get(0).getColumnName();
        }
        if (tfrms.get(i).getOutputColumns().get(0).getParentTable().getCompleteName().equals(targetTableName) && 
           !sourceColumnName.equals("") && 
           !tfrms.get(i).getTransLookupCondition().equals("")) {
            clc.append("                        <Lookup Name=\"" + tfrms.get(i).getLookupOn() + "Lookup\" OleDbConnectionName=\"IngestAutomationUtil\" NoMatchBehavior=\"IgnoreFailure\" >\n");
            clc.append("                        <InputPath OutputPathName=\"" + RemoveCharacter(sourceTableName) + ".Output\" />\n");
            clc.append("                            <DirectInput>\n");
            clc.append("                                " + tfrms.get(i).getTransLookupCondition() +  "\n");
            clc.append("                            </DirectInput>\n");
            clc.append("                            <Inputs>\n");
            clc.append("                                <Column SourceColumn=\"" + tfrms.get(i).getLookupOn() + "\" />\n");
            clc.append("                            </Inputs>\n");
            clc.append("                            <Outputs>\n");
            clc.append("                                <Column SourceColumn=\"" + tfrms.get(i).getLookupColumn()+ "\" />\n");
            clc.append("                            </Outputs>\n");
            clc.append("                        </Lookup>\n");
        }
    }
    return clc;
}

function RemoveCharacter(removeCharacterString) {
    var rc = "";
    rc = removeCharacterString.replace(" ", "").replace(")","").replace("(","").replace("-","").replace("_","").replace(".","").replace("&","");
    if (!isNaN(rc.substring(0,1))) {
        rc = ("N" + rc);
    }
    //var a = isNaN(123) + "<br>";
    return rc;
}

function OutputBufferRows() {
    var obr = new java.lang.StringBuffer();
    var mapId = MAPPING.getMappingInfo().getMappingId();
    var storedProcsString = "";
    var projectId = "";
    var projectDAO = new com.icc.resourcemanager.dao.ProjectDao();
    var projects = projectDAO.getAllProjectsList();
    var plen = projects.size();
    var str = "";
        for(var j=plen-1; j>=0; j--)
        {
            str = projects.get(j).getProjName();
            if (str.equals("Ingest Automation")) {
                projectId = projects.get(j).getProjId();
            }
        }
    var mappingDao = new com.icc.mappingmanager.dao.MappingDao();
    var mappingVo = mappingDao.getMapDetails(projectId, mapId);
    
    if (!mappingVo.getUserDefinedNotes4().equals("Calendar")) {
        var srcSystemArr = mapping.getSourceSystems().values().toArray();
        for (i = 0; i < srcSystemArr.length; i++) {
            var system = srcSystemArr[i];
            var envArr = system.getEnvironmentMap().values().toArray();
                for(j=0; j < envArr.length;j++){
                var environment= envArr[j];
                var tabArr = environment.getTableMap().values().toArray();
                for(k=0; k < tabArr.length; k++){
                    var table = tabArr[k];
                    var colArr = table.getColumnMap().values().toArray();
                    for(l = 0; l < colArr.length; l++){
                        var column= colArr[l];
                        var dataLength = column.getLength();
                        if (!column.getColumnName().toLowerCase().equals("dummy")) {
                            if (!isNaN(column.getColumnName().substring(0,1))) {
                                obr.append("                        <Column Name=\"N" + column.getColumnName() + "\" DataType=\"String\" Length=\"" + dataLength + "\" />\n");
                            }
                            else {
                                //obr.append(i + " " + j + " " + k + "                        <Column Name=\"" + column.getColumnName() + "\" DataType=\"String\" Length=\"" + dataLength + "\" />\n");
                                obr.append("                        <Column Name=\"" + column.getColumnName() + "\" DataType=\"String\" Length=\"" + dataLength + "\" />\n");
                            }
                        }
                    }
                }
            }
        }
    } else if (mappingVo.getUserDefinedNotes4().equals("Calendar")) {
        obr.append("                        <Column Name=\"Column1\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column2\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column3\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column4\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column5\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column6\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column7\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column8\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column9\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column10\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column11\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column12\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column13\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column14\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column15\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column16\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column17\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column18\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column19\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column20\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column21\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column22\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column23\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column24\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column25\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column26\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column27\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column28\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column29\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column30\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column31\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column32\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column33\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column34\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column35\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column36\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column37\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column38\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column39\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column40\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column41\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column42\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column43\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column44\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column45\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column46\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column47\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column48\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column49\" DataType=\"String\" Length=\"4000\" />\n");
        obr.append("                        <Column Name=\"Column50\" DataType=\"String\" Length=\"4000\" />\n");
    }
    return obr;
}

function ExcelBufferRows() {
    var ebr = new java.lang.StringBuffer();
    var mapId = MAPPING.getMappingInfo().getMappingId();
    var storedProcsString = "";
    var projectId = "";
    var projectDAO = new com.icc.resourcemanager.dao.ProjectDao();
    var projects = projectDAO.getAllProjectsList();
    var plen = projects.size();
    var str = "";
        for(var j=plen-1; j>=0; j--)
        {
            str = projects.get(j).getProjName();
            if (str.equals("Ingest Automation")) {
                projectId = projects.get(j).getProjId();
            }
        }
    var mappingDao = new com.icc.mappingmanager.dao.MappingDao();
    var mappingVo = mappingDao.getMapDetails(projectId, mapId);
    
    if (!mappingVo.getUserDefinedNotes4().equals("Calendar")) {
        var srcSystemArr = mapping.getSourceSystems().values().toArray();
        for (i = 0; i < srcSystemArr.length; i++) {
        var system = srcSystemArr[i];
        var envArr = system.getEnvironmentMap().values().toArray();
            for(j=0; j < envArr.length;j++){
                var environment= envArr[j];
                var tabArr = environment.getTableMap().values().toArray();
                for(k=0; k < tabArr.length; k++){
                    var table = tabArr[k];
                    var colArr = table.getColumnMap().values().toArray();
                    for(l = 0; l < colArr.length; l++){
                        var column = colArr[l];
                        var columnNameCleansed = RemoveCharacter(column.getColumnName());
                        if (!column.getColumnName().toLowerCase().equals("dummy")) {
                            ebr.append("                Output0Buffer." + columnNameCleansed + " = dr.GetValue(GetColumnIndex(\"" + column.getColumnName() + "\", " + (l) + ", excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
                        }
                    }
                }
            }
        }
    }
    else {
        ebr.append(GetExcelCalendarBuffer());
    }
    return ebr;
}

function ScriptSourceHeaders() {
    var ssh = new java.lang.StringBuffer();
    var mapId = MAPPING.getMappingInfo().getMappingId();
    var storedProcsString = "";
    var projectId = "";
    var projectDAO = new com.icc.resourcemanager.dao.ProjectDao();
    var projects = projectDAO.getAllProjectsList();
    var plen = projects.size();
    var str = "";
        for(var j=plen-1; j>=0; j--)
        {
            str = projects.get(j).getProjName();
            if (str.equals("Ingest Automation")) {
                projectId = projects.get(j).getProjId();
            }
        }
    var mappingDao = new com.icc.mappingmanager.dao.MappingDao();
    var mappingVo = mappingDao.getMapDetails(projectId, mapId);
    
    if (mappingVo.getUserDefinedNotes4().equals("Calendar")) {
        ssh.append("");
    }
    else {
        var srcSystemArr = mapping.getSourceSystems().values().toArray();
        for (i = 0; i < srcSystemArr.length; i++) {
            var system = srcSystemArr[i];
            var envArr = system.getEnvironmentMap().values().toArray();
                for(j=0; j < envArr.length;j++){
                var environment= envArr[j];
                var tabArr = environment.getTableMap().values().toArray();
                for(k=0; k < tabArr.length; k++){
                    var table = tabArr[k];
                    var colArr = table.getColumnMap().values().toArray();
                    for(l = 0; l < colArr.length; l++){
                        var column= colArr[l];
                        if (!column.getColumnName().toLowerCase().equals("dummy")) {
                            ssh.append("        sourceHeaders.Add(\"" + column.getColumnName() + "\");\n");
                        }
                    }
                }
            }
        }
    }
    return ssh;
}

function TextBufferRows() {
    var tbr = new java.lang.StringBuffer();
    var mapId = MAPPING.getMappingInfo().getMappingId();
    var storedProcsString = "";
    var projectId = "";
    var projectDAO = new com.icc.resourcemanager.dao.ProjectDao();
    var projects = projectDAO.getAllProjectsList();
    var plen = projects.size();
    var str = "";
        for(var j=plen-1; j>=0; j--)
        {
            str = projects.get(j).getProjName();
            if (str.equals("Ingest Automation")) {
                projectId = projects.get(j).getProjId();
            }
        }
    var mappingDao = new com.icc.mappingmanager.dao.MappingDao();
    var mappingVo = mappingDao.getMapDetails(projectId, mapId);
    var srcSystemArr = mapping.getSourceSystems().values().toArray();
    if (!mappingVo.getUserDefinedNotes4().equals("Calendar")) {
        for (i = 0; i < srcSystemArr.length; i++) {
            var system = srcSystemArr[i];
            var envArr = system.getEnvironmentMap().values().toArray();
                for(j=0; j < envArr.length;j++){
                var environment= envArr[j];
                var tabArr = environment.getTableMap().values().toArray();
                for(k=0; k < tabArr.length; k++){
                    var table = tabArr[k];
                    var colArr = table.getColumnMap().values().toArray();
                    for(l = 0; l < colArr.length; l++){
                        var column= colArr[l];
                        var columnNameCleansed = RemoveCharacter(column.getColumnName());
                        if (!column.getColumnName().toLowerCase().equals("dummy")) {
                            tbr.append("                Output0Buffer." + columnNameCleansed + " = GetTextBufferValue(\"" + column.getColumnName() + "\", " + (l) + ", textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
                        }
                    }
                }
            }
        }
    } 
    else {
        tbr.append(GetTextCalendarBuffer());
    }
    return tbr;
}

function GetExcelCalendarBuffer() {
    var gecb = new java.lang.StringBuffer();
        gecb.append("                Output0Buffer.Column1 = dr.GetValue(GetColumnIndex(\"\", 0, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column2 = dr.GetValue(GetColumnIndex(\"\", 1, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column3 = dr.GetValue(GetColumnIndex(\"\", 2, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column4 = dr.GetValue(GetColumnIndex(\"\", 3, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column5 = dr.GetValue(GetColumnIndex(\"\", 4, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column6 = dr.GetValue(GetColumnIndex(\"\", 5, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column7 = dr.GetValue(GetColumnIndex(\"\", 6, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column8 = dr.GetValue(GetColumnIndex(\"\", 7, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column9 = dr.GetValue(GetColumnIndex(\"\", 8, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column10 = dr.GetValue(GetColumnIndex(\"\", 9, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column11 = dr.GetValue(GetColumnIndex(\"\", 10, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column12 = dr.GetValue(GetColumnIndex(\"\", 11, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column13 = dr.GetValue(GetColumnIndex(\"\", 12, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column14 = dr.GetValue(GetColumnIndex(\"\", 13, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column15 = dr.GetValue(GetColumnIndex(\"\", 14, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column16 = dr.GetValue(GetColumnIndex(\"\", 15, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column17 = dr.GetValue(GetColumnIndex(\"\", 16, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column18 = dr.GetValue(GetColumnIndex(\"\", 17, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column19 = dr.GetValue(GetColumnIndex(\"\", 18, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column20 = dr.GetValue(GetColumnIndex(\"\", 19, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column21 = dr.GetValue(GetColumnIndex(\"\", 20, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column22 = dr.GetValue(GetColumnIndex(\"\", 21, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column23 = dr.GetValue(GetColumnIndex(\"\", 22, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column24 = dr.GetValue(GetColumnIndex(\"\", 23, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column25 = dr.GetValue(GetColumnIndex(\"\", 24, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column26 = dr.GetValue(GetColumnIndex(\"\", 25, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column27 = dr.GetValue(GetColumnIndex(\"\", 26, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column28 = dr.GetValue(GetColumnIndex(\"\", 27, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column29 = dr.GetValue(GetColumnIndex(\"\", 28, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column30 = dr.GetValue(GetColumnIndex(\"\", 29, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column31 = dr.GetValue(GetColumnIndex(\"\", 30, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column32 = dr.GetValue(GetColumnIndex(\"\", 31, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column33 = dr.GetValue(GetColumnIndex(\"\", 32, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column34 = dr.GetValue(GetColumnIndex(\"\", 33, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column35 = dr.GetValue(GetColumnIndex(\"\", 34, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column36 = dr.GetValue(GetColumnIndex(\"\", 35, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column37 = dr.GetValue(GetColumnIndex(\"\", 36, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column38 = dr.GetValue(GetColumnIndex(\"\", 37, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column39 = dr.GetValue(GetColumnIndex(\"\", 38, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column40 = dr.GetValue(GetColumnIndex(\"\", 39, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column41 = dr.GetValue(GetColumnIndex(\"\", 40, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column42 = dr.GetValue(GetColumnIndex(\"\", 41, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column43 = dr.GetValue(GetColumnIndex(\"\", 42, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column44 = dr.GetValue(GetColumnIndex(\"\", 43, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column45 = dr.GetValue(GetColumnIndex(\"\", 44, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column46 = dr.GetValue(GetColumnIndex(\"\", 45, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column47 = dr.GetValue(GetColumnIndex(\"\", 46, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column48 = dr.GetValue(GetColumnIndex(\"\", 47, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column49 = dr.GetValue(GetColumnIndex(\"\", 48, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
        gecb.append("                Output0Buffer.Column50 = dr.GetValue(GetColumnIndex(\"\", 49, excelSheet.HasHeaders, excelSheet.HeaderArray, excelSheet.NumOfColumns)).ToString();\n");
    return gecb;
    }
    
function GetTextCalendarBuffer() {
    var gecb = new java.lang.StringBuffer();
        gecb.append("                Output0Buffer.Column1 = GetTextBufferValue(\"\", 0, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column2 = GetTextBufferValue(\"\", 1, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column3 = GetTextBufferValue(\"\", 2, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column4 = GetTextBufferValue(\"\", 3, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column5 = GetTextBufferValue(\"\", 4, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column6 = GetTextBufferValue(\"\", 5, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column7 = GetTextBufferValue(\"\", 6, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column8 = GetTextBufferValue(\"\", 7, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column9 = GetTextBufferValue(\"\", 8, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column10 = GetTextBufferValue(\"\", 9, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column11 = GetTextBufferValue(\"\", 10, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column12 = GetTextBufferValue(\"\", 11, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column13 = GetTextBufferValue(\"\", 12, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column14 = GetTextBufferValue(\"\", 13, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column15 = GetTextBufferValue(\"\", 14, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column16 = GetTextBufferValue(\"\", 15, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column17 = GetTextBufferValue(\"\", 16, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column18 = GetTextBufferValue(\"\", 17, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column19 = GetTextBufferValue(\"\", 18, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column20 = GetTextBufferValue(\"\", 19, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column21 = GetTextBufferValue(\"\", 20, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column22 = GetTextBufferValue(\"\", 21, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column23 = GetTextBufferValue(\"\", 22, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column24 = GetTextBufferValue(\"\", 23, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column25 = GetTextBufferValue(\"\", 24, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column26 = GetTextBufferValue(\"\", 25, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column27 = GetTextBufferValue(\"\", 26, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column28 = GetTextBufferValue(\"\", 27, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column29 = GetTextBufferValue(\"\", 28, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column30 = GetTextBufferValue(\"\", 29, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column31 = GetTextBufferValue(\"\", 30, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column32 = GetTextBufferValue(\"\", 31, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column33 = GetTextBufferValue(\"\", 32, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column34 = GetTextBufferValue(\"\", 33, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column35 = GetTextBufferValue(\"\", 34, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column36 = GetTextBufferValue(\"\", 35, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column37 = GetTextBufferValue(\"\", 36, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column38 = GetTextBufferValue(\"\", 37, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column39 = GetTextBufferValue(\"\", 38, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column40 = GetTextBufferValue(\"\", 39, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column41 = GetTextBufferValue(\"\", 40, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column42 = GetTextBufferValue(\"\", 41, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column43 = GetTextBufferValue(\"\", 42, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column44 = GetTextBufferValue(\"\", 43, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column45 = GetTextBufferValue(\"\", 44, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column46 = GetTextBufferValue(\"\", 45, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column47 = GetTextBufferValue(\"\", 46, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column48 = GetTextBufferValue(\"\", 47, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column49 = GetTextBufferValue(\"\", 48, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
        gecb.append("                Output0Buffer.Column50 = GetTextBufferValue(\"\", 49, textFile.HasHeaders, textFile.HeaderArray, textFile.NumOfColumns, columns);\n");
    return gecb;
    }

function SourceExtractDestination() {
    var sed = new java.lang.StringBuffer();
    var tfrms =  mapping.getTransformations();
    var sourceTableName = tfrms.get(0).getInputColumns().get(0).getParentTable().getCompleteName();
    var mapId = MAPPING.getMappingInfo().getMappingId();
    var storedProcsString = "";
    var projectId = "";
    var projectDAO = new com.icc.resourcemanager.dao.ProjectDao();
    var projects = projectDAO.getAllProjectsList();
    var plen = projects.size();
    var str = "";
        for(var j=plen-1; j>=0; j--)
        {
            str = projects.get(j).getProjName();
            if (str.equals("Ingest Automation")) {
                projectId = projects.get(j).getProjId();
            }
        }
    var mappingDao = new com.icc.mappingmanager.dao.MappingDao();
    var mappingVo = mappingDao.getMapDetails(projectId, mapId);
    if (mappingVo.getUserDefinedNotes4().equals("Calendar")) {
        sed.append("                        <OleDbDestination Name=\"LoadTempTable\" ConnectionName=\"IngestAutomationUtil\" UseFastLoadIfAvailable=\"false\" MaximumInsertCommitSize=\"2147483647\" DefaultCodePage=\"1252\" FastLoadOptions=\"\">\n");
        sed.append("                            <ExternalTableOutput Table=\"[temp].[" + sourceTableName + "]\" />\n");
        sed.append("                        </OleDbDestination>\n");
    } 
    else {
        sed.append("                        <OleDbDestination Name=\"LoadUtilityTable\" ConnectionName=\"IngestAutomationUtil\" UseFastLoadIfAvailable=\"false\" MaximumInsertCommitSize=\"2147483647\" DefaultCodePage=\"1252\" FastLoadOptions=\"\">\n");
        sed.append("                            <ExternalTableOutput Table=\"[util].[" + sourceTableName + "]\" />\n");
        sed.append("                        </OleDbDestination>\n");
    }
    return sed;
}
