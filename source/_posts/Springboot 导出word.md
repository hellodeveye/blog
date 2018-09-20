---
title: Springboot 导出word
date: 2018-09-05 17:18:00
tags: word
categories: Springboot
cover: /img/3.jpg
---
### Springboot 导出Word
**使用`Springboot`利用`Freemarker`导出Word2007。**
### 第一步
新建word 2007 文件，填写word内容。  

![](/img/1.png)

### 第二步
使用**压缩软件**打开word文件，将“word/document.xml”文件复制到Springboot项目中，放在templates目录下，重命名为`test.ftl`。  

![](/img/2.png)

### 第三步
编写代码：  
```
@Slf4j
public class ExportUtil {

	public static String outDocx(String ftlTemplateName, Object dataMap, HttpServletRequest request) throws IOException, URISyntaxException, TemplateException {
		//获取模板
		//创建配置实例
		Configuration configuration = new Configuration();
		//设置编码
		configuration.setDefaultEncoding("UTF-8");
		//设置模板保存路径
		configuration.setClassForTemplateLoading(ExportUtil.class, "/templates/");
		//获取模板
		Template template = configuration.getTemplate(ftlTemplateName);

		//临时文件
		String outTempFtlFilePath = request.getServletContext().getRealPath("/export/emp/docx/temp.ftl");
		File outFtlFile = new File(outTempFtlFilePath);
		//如果输出目标文件夹不存在，则创建
		if (!outFtlFile.getParentFile().exists()) {
			boolean mkdirs = outFtlFile.getParentFile().mkdirs();
			if (!mkdirs) {
				log.error("word导出===》创建文件夹出现异常");
			}
		}

		//填充完数据的临时ftl
		Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outFtlFile), "UTF-8"));
		//合并数据
		template.process(dataMap, writer);
		writer.close();
		//输出文件路径
		String outFilePath = "";
		ZipFile zipFile = null;
		InputStream is = null;
		InputStream in = null;
		ZipOutputStream zipOut = null;
		try {
			//空白Word 文件 用于替换新数据
			String fileName = "template.docx";
			Resource resource = new ClassPathResource("static/"+fileName);
			InputStream inputStream = resource.getInputStream();
			String templateFile = request.getServletContext().getRealPath("/export/emp/docx/template/");
			File file = new File(templateFile, fileName);
			if (!file.exists()) {
				try {
					boolean mkdirs = file.getParentFile().mkdirs();
					if (!mkdirs) {
						log.error("word导出===》创建文件夹出现异常");
					}
					boolean newFile = file.createNewFile();
					if (!newFile) {
						log.error("word导出===》创建文件出现异常");
					}
					FileUtils.copyInputStreamToFile(inputStream, file);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			zipFile = new ZipFile(file);
			Enumeration<? extends ZipEntry> zipEntrys = zipFile.entries();
			outFilePath = request.getServletContext().getRealPath("/export/emp/docx/temp.docx");
			zipOut = new ZipOutputStream(new FileOutputStream(outFilePath));
			int len = -1;
			byte[] buffer = new byte[1024];
			while (zipEntrys.hasMoreElements()) {
				ZipEntry next = zipEntrys.nextElement();
				is = zipFile.getInputStream(next);
				//把输入流的文件传到输出流中 如果是word/document.xml由我们输入
				zipOut.putNextEntry(new ZipEntry(next.toString()));
				if ("word/document.xml".equals(next.toString())) {
					in = new FileInputStream(outFtlFile);
					while ((len = in.read(buffer)) != -1) {
						zipOut.write(buffer, 0, len);
					}
				} else {
					while ((len = is.read(buffer)) != -1) {
						zipOut.write(buffer, 0, len);
					}
				}
			}
		} catch (FileNotFoundException e) {
			log.error("word导出===》找不到文件[{}]",e.getMessage());
		} finally {
			try {
				if (in != null) {
					is.close();
				}
				if (is != null) {
					is.close();
				}
				if (zipOut != null) {
					zipOut.close();
				}
				if(zipFile != null){
					zipFile.close();
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return outFilePath;
	}
}
```

```
@Slf4j
@Controller
@RequestMapping("/export")
public class ExportController {

	@GetMapping(value = "/word", produces = "application/octet-stream")
	public void word(HttpServletRequest request, HttpServletResponse response) {
		InputStream fis = null;
		OutputStream os = null;
		try {
			//文件生成路径
			String outFilePath = "";
			//文件名称
			String fileName = "test.docx";
			Map<String,String> map = new HashMap<>();
			map.put("name","张三");
			map.put("sex","男");
			map.put("age","22");


			//判断试卷类型
			outFilePath = ExportUtil.outDocx("test.ftl", map, request);
			fis = new BufferedInputStream(new FileInputStream(outFilePath));
			byte[] buffer = new byte[fis.available()];
			fis.read(buffer);
			// 清空response
			response.reset();
			response.setContentType("application/octet-stream");
			response.addHeader("Content-Disposition", "attachment; filename=" + new String(fileName.getBytes("GB2312"), "ISO-8859-1"));
			os = new BufferedOutputStream(response.getOutputStream());
			os.write(buffer);
		} catch (Exception e) {
			log.error("word导出===》未知异常[{}]", e.getMessage());
		} finally {
			try {
				if (os != null) {
					os.close();
				}
				if (fis != null) {
					fis.close();
				}
			} catch (IOException e) {
				log.error("word导出===》流关闭异常[{}]", e.getMessage());
			}
		}
	}

}
```
### 第四步
修改`test.ftl`文件，将要填充的数据插入到模板。
```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
            xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
            xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
            xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml"
            xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing"
            xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
            xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
            xmlns:w10="urn:schemas-microsoft-com:office:word"
            xmlns:w15="http://schemas.microsoft.com/office/word/2012/wordml"
            xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup"
            xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk"
            xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml"
            xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
            xmlns:wpsCustomData="http://www.wps.cn/officeDocument/2013/wpsCustomData" mc:Ignorable="w14 w15 wp14">
	<w:body>
		<w:tbl>
			<w:tblPr>
				<w:tblStyle w:val="5"/>
				<w:tblW w:w="8522" w:type="dxa"/>
				<w:tblInd w:w="0" w:type="dxa"/>
				<w:tblBorders>
					<w:top w:val="single" w:color="auto" w:sz="4" w:space="0"/>
					<w:left w:val="single" w:color="auto" w:sz="4" w:space="0"/>
					<w:bottom w:val="single" w:color="auto" w:sz="4" w:space="0"/>
					<w:right w:val="single" w:color="auto" w:sz="4" w:space="0"/>
					<w:insideH w:val="single" w:color="auto" w:sz="4" w:space="0"/>
					<w:insideV w:val="single" w:color="auto" w:sz="4" w:space="0"/>
				</w:tblBorders>
				<w:tblLayout w:type="fixed"/>
				<w:tblCellMar>
					<w:left w:w="108" w:type="dxa"/>
					<w:right w:w="108" w:type="dxa"/>
				</w:tblCellMar>
			</w:tblPr>
			<w:tblGrid>
				<w:gridCol w:w="2840"/>
				<w:gridCol w:w="2841"/>
				<w:gridCol w:w="2841"/>
			</w:tblGrid>
			<w:tr>
				<w:tblPrEx>
					<w:tblBorders>
						<w:top w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:left w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:bottom w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:right w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:insideH w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:insideV w:val="single" w:color="auto" w:sz="4" w:space="0"/>
					</w:tblBorders>
					<w:tblLayout w:type="fixed"/>
				</w:tblPrEx>
				<w:tc>
					<w:tcPr>
						<w:tcW w:w="2840" w:type="dxa"/>
					</w:tcPr>
					<w:p>
						<w:pPr>
							<w:rPr>
								<w:rFonts w:hint="eastAsia" w:eastAsiaTheme="minorEastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:val="en-US" w:eastAsia="zh-CN"/>
							</w:rPr>
						</w:pPr>
						<w:r>
							<w:rPr>
								<w:rFonts w:hint="eastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:val="en-US" w:eastAsia="zh-CN"/>
							</w:rPr>
							<w:t>姓名</w:t>
						</w:r>
					</w:p>
				</w:tc>
				<w:tc>
					<w:tcPr>
						<w:tcW w:w="2841" w:type="dxa"/>
					</w:tcPr>
					<w:p>
						<w:pPr>
							<w:rPr>
								<w:rFonts w:hint="eastAsia" w:eastAsiaTheme="minorEastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:eastAsia="zh-CN"/>
							</w:rPr>
						</w:pPr>
						<w:r>
							<w:rPr>
								<w:rFonts w:hint="eastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:eastAsia="zh-CN"/>
							</w:rPr>
							<w:t>性别</w:t>
						</w:r>
					</w:p>
				</w:tc>
				<w:tc>
					<w:tcPr>
						<w:tcW w:w="2841" w:type="dxa"/>
					</w:tcPr>
					<w:p>
						<w:pPr>
							<w:rPr>
								<w:rFonts w:hint="eastAsia" w:eastAsiaTheme="minorEastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:eastAsia="zh-CN"/>
							</w:rPr>
						</w:pPr>
						<w:r>
							<w:rPr>
								<w:rFonts w:hint="eastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:eastAsia="zh-CN"/>
							</w:rPr>
							<w:t>年龄</w:t>
						</w:r>
						<w:bookmarkStart w:id="0" w:name="_GoBack"/>
						<w:bookmarkEnd w:id="0"/>
					</w:p>
				</w:tc>
			</w:tr>

            <!--tr-->
			<w:tr>
				<w:tblPrEx>
					<w:tblBorders>
						<w:top w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:left w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:bottom w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:right w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:insideH w:val="single" w:color="auto" w:sz="4" w:space="0"/>
						<w:insideV w:val="single" w:color="auto" w:sz="4" w:space="0"/>
					</w:tblBorders>
					<w:tblLayout w:type="fixed"/>
				</w:tblPrEx>
				<w:tc>
					<w:tcPr>
						<w:tcW w:w="2840" w:type="dxa"/>
					</w:tcPr>
					<w:p>
						<w:pPr>
							<w:rPr>
								<w:rFonts w:hint="eastAsia" w:eastAsiaTheme="minorEastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:val="en-US" w:eastAsia="zh-CN"/>
							</w:rPr>
						</w:pPr>
						<w:r>
							<w:rPr>
								<w:rFonts w:hint="eastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:val="en-US" w:eastAsia="zh-CN"/>
							</w:rPr>
							<w:t>${name}</w:t>
						</w:r>
					</w:p>
				</w:tc>
				<w:tc>
					<w:tcPr>
						<w:tcW w:w="2841" w:type="dxa"/>
					</w:tcPr>
					<w:p>
						<w:pPr>
							<w:rPr>
								<w:rFonts w:hint="eastAsia" w:eastAsiaTheme="minorEastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:eastAsia="zh-CN"/>
							</w:rPr>
						</w:pPr>
						<w:r>
							<w:rPr>
								<w:rFonts w:hint="eastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:eastAsia="zh-CN"/>
							</w:rPr>
							<w:t>${sex}</w:t>
						</w:r>
					</w:p>
				</w:tc>
				<w:tc>
					<w:tcPr>
						<w:tcW w:w="2841" w:type="dxa"/>
					</w:tcPr>
					<w:p>
						<w:pPr>
							<w:rPr>
								<w:rFonts w:hint="eastAsia" w:eastAsiaTheme="minorEastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:eastAsia="zh-CN"/>
							</w:rPr>
						</w:pPr>
						<w:r>
							<w:rPr>
								<w:rFonts w:hint="eastAsia"/>
								<w:vertAlign w:val="baseline"/>
								<w:lang w:eastAsia="zh-CN"/>
							</w:rPr>
							<w:t>${age}</w:t>
						</w:r>
						<w:bookmarkStart w:id="0" w:name="_GoBack"/>
						<w:bookmarkEnd w:id="0"/>
					</w:p>
				</w:tc>
			</w:tr>
			<!--tr-->
        </w:tbl>
		<w:p/>
		<w:sectPr>
			<w:pgSz w:w="11906" w:h="16838"/>
			<w:pgMar w:top="1440" w:right="1800" w:bottom="1440" w:left="1800" w:header="851" w:footer="992"
			         w:gutter="0"/>
			<w:cols w:space="425" w:num="1"/>
			<w:docGrid w:type="lines" w:linePitch="312" w:charSpace="0"/>
		</w:sectPr>
	</w:body>
</w:document>
```

### 第五步
浏览器输入：[http://localhost:8080/export/word](http://localhost:8080/export/word) 导出word文件。

> 源码地址：[https://gitee.com/theferryman/springboot-example](https://gitee.com/theferryman/springboot-example)
