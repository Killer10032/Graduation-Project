package com.yjq.programmer.service;

import com.yjq.programmer.dto.CategoryDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;

import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 11:02
 */
public interface ICategoryService {

    // 分页获取文章分类数据
    ResponseDTO<PageDTO<CategoryDTO>> getCategoryList(PageDTO<CategoryDTO> pageDTO);

    // 保存文章分类信息
    ResponseDTO<Boolean> saveCategory(CategoryDTO categoryDTO);

    // 删除文章分类信息
    ResponseDTO<Boolean> deleteCategory(CategoryDTO categoryDTO);

    // 获取所有文章分类数据
    ResponseDTO<List<CategoryDTO>> getAllCategoryList();
}
