package com.yjq.programmer.controller.admin;

import com.yjq.programmer.dto.CategoryDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.ICategoryService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 11:02
 */
@RestController("AdminCategoryController")
@RequestMapping("/admin/category")
public class CategoryController {

    @Resource
    private ICategoryService categoryService;

    /**
     * 分页获取文章分类数据
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<CategoryDTO>> getCategoryList(@RequestBody PageDTO<CategoryDTO> pageDTO){
        return categoryService.getCategoryList(pageDTO);
    }

    /**
     * 删除文章分类信息
     * @param categoryDTO
     * @return
     */
    @PostMapping("/delete")
    public ResponseDTO<Boolean> deleteCategory(@RequestBody CategoryDTO categoryDTO){
        return categoryService.deleteCategory(categoryDTO);
    }

    /**
     * 保存文章分类信息
     * @param categoryDTO
     * @return
     */
    @PostMapping("/save")
    public ResponseDTO<Boolean> saveCategory(@RequestBody CategoryDTO categoryDTO){
        return categoryService.saveCategory(categoryDTO);
    }

}
