package com.yjq.programmer.controller.web;

import com.yjq.programmer.dto.CategoryDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.ICategoryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-17 8:49
 */
@RestController("WebCategoryController")
@RequestMapping("/web/category")
public class CategoryController {

    @Resource
    private ICategoryService categoryService;

    /**
     * 查询所有文章分类数据
     * @return
     */
    @PostMapping("/all")
    public ResponseDTO<List<CategoryDTO>> getAllCategoryList(){
        return categoryService.getAllCategoryList();
    }

}
