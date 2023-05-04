package com.tell.controller;

import com.tell.bean.Page;
import com.tell.bean.Result;
import com.tell.conf.properties.SiteConfig;
import com.tell.exception.ApiAssert;
import com.tell.model.Article;
import com.tell.model.Theme;
import com.tell.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class ThemeController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private com.tell.service.ThemeService ThemeService;

    @Autowired
    private SiteConfig siteConfig;

    /**
     * 根据主题名称查询文章
     * @param themeName: 主题名称
     * @param pageNo: 当前页
     * @return
     */
    @GetMapping(value = "/theme/articles")
    private Result detail(@RequestParam(value = "themeName") String themeName,
                          @RequestParam(value = "pageNo",defaultValue = "1") Integer pageNo){
        ApiAssert.notNull(themeName,"主题名称不能为空");
        Page<Article> page = articleService.pageByThemeName(pageNo, siteConfig.getPageSize(), themeName);
        return Result.success(page);
    }

    /**
     * 获取所有的主题
     * @return
     */
    @GetMapping(value = "/themes")
    private Result themeList(){
        List<Theme> list = ThemeService.findThemeAll(null, null);
        return Result.success(list);
    }
}
