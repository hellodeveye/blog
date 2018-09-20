---
title: SpringMVC 自定义主题
date: 2018-08-28 09:37:18
tags: spring
categories: spring mvc
---
## SpringMVC 自定义主题  
### 前言
要在你的应用中使用主题，你必须实现一个`org.springframework.ui.context.ThemeSource`接口。`WebApplicationContext`接口继承了`ThemeSource`接口，但主要的工作它还是委托给接口具体的实现来完成。默认的实现是`org.springframework.ui.context.support.ResourceBundleThemeSource`，它会从`classpath`的根路径下去加载配置文件。如果需要定制`ThemeSource`的实现，或要配置`ResourceBundleThemeSource`的基本前缀名（base name prefix），你可以在应用上下文（`application context`）下注册一个名字为保留名`themeSource`的bean，web应用的上下文会自动检测名字为`themeSource`的bean并使用它。  
### 第一步  
```
@Configuration
public class ThemeSourceConfig {

	@Bean
	public ThemeChangeInterceptor themeChangeInterceptor(){
		ThemeChangeInterceptor themeChangeInterceptor = new ThemeChangeInterceptor();
		// 设置主题拦截器 拦截URL的请求参数
		themeChangeInterceptor.setParamName("themeName");
		return themeChangeInterceptor;
	}


	@Bean
	public ResourceBundleThemeSource themeSource(){
		ResourceBundleThemeSource themeSource = new ResourceBundleThemeSource();
		return themeSource;
	}

	@Bean
	public SessionThemeResolver themeResolver(){
		SessionThemeResolver sessionThemeResolver = new SessionThemeResolver();
		//设置默认主题为sunrise
		sessionThemeResolver.setDefaultThemeName("sunrise");
		return sessionThemeResolver;
	}

}
```
### 第二步
`resources`目录下存在两个主题配置文件:`sunrise.properties`,`sunrise.properties`  
```
# 值为主题的样式
theme.css=blog/css/style.min.css 
```
### 第三步
将`spring-webmvc`里的`org/springframework/web/servlet/view/freemarker`下的`spring.ftl include`到公共模板文件夹内，比如将这个spring.ftl复制在ftl文件目录的common下，可以这样直接在ftl里include进来  
```
<#import "common/spring.ftl" as spring>
```
再将样式文件引入改为：  
```
<!--定义一个变量为 "maincss"-->
  <#assign maincss>
        <!--theme.css 为properties 文件中的key值 -->
        <@spring.theme code="theme.css"/>
    </#assign>
	<link href="${maincss}" rel="stylesheet">
```
### 最后
Spring也提供了一个主题更改拦截器`ThemeChangeInterceptor`，以支持主题的更换。这很容易做到，只需要在请求中携带一个简单的请求参数即可。
```
@Autowired
private ThemeResolver themeResolver;

@RequestMapping("/changeTheme")
public String changeTheme(HttpServletRequest request,
                        HttpServletResponse response, String themeName) {
    themeResolver.setThemeName(request, response, themeName);
    return "index";
}
```
### 其他
`ThemeResolver`接口的实现  
<table><tr><th>类名</th><th>描述</th></tr><tr><td>FixedThemeResolver</td><td>选择一个固定的主题，这是通过设置defaultThemeName这个属性值实现的</td></tr><tr><td>SessionThemeResolver</td><td>请求相关的主题保存在用户的HTTP会话（session）中。对于每个会话来说，它只需要被设置一次，但它不能在会话之间保存</td></tr><tr><td>CookieThemeResolver</td><td>选中的主题被保存在客户端的cookie中</td></tr></table>