package com.yjq.programmer.controller.admin;

import com.yjq.programmer.dto.ArticleDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.IArticleService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-21 9:07
 */
@RestController("AdminArticleController")
@RequestMapping("/admin/article")
public class ArticleController {

    @Resource
    private IArticleService articleService;

    /**
     * 分页获取文章数据
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<ArticleDTO>> getArticleList(@RequestBody PageDTO<ArticleDTO> pageDTO){
        return articleService.getArticleList(pageDTO);
    }

    /**
     * 修改文章信息
     * @param articleDTO
     * @return
     */
    @PostMapping("/update")
    public ResponseDTO<Boolean> updateArticleInfo(@RequestBody ArticleDTO articleDTO){
        return articleService.updateArticleInfo(articleDTO);
    }

    /**
     * 删除文章信息
     * @param articleDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteArticle(@RequestBody ArticleDTO articleDTO){
        return articleService.deleteArticle(articleDTO);
    }

    /**
     * 获取文章总数
     * @param articleDTO
     * @return
     */
    @PostMapping("/total")
    public ResponseDTO<Integer> getArticleTotal(@RequestBody ArticleDTO articleDTO){
        return articleService.getArticleTotal(articleDTO);
    }

    /**
     * 根据日期时间获取文章总数
     * @return
     */
    @PostMapping("/total_day")
    public ResponseDTO<List<Integer>> getArticleTotalByDay(){
        return articleService.getArticleTotalByDay();
    }

}
