package com.yjq.programmer.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yjq.programmer.bean.CodeMsg;
import com.yjq.programmer.dao.CategoryMapper;
import com.yjq.programmer.domain.Category;
import com.yjq.programmer.domain.CategoryExample;
import com.yjq.programmer.dto.CategoryDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.ICategoryService;
import com.yjq.programmer.utils.CommonUtil;
import com.yjq.programmer.utils.CopyUtil;
import com.yjq.programmer.utils.UuidUtil;
import com.yjq.programmer.utils.ValidateEntityUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 11:03
 */
@Service
@Transactional
public class CategoryServiceImpl implements ICategoryService {

    @Resource
    private CategoryMapper categoryMapper;

    /**
     * 分页获取文章分类数据
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<CategoryDTO>> getCategoryList(PageDTO<CategoryDTO> pageDTO) {
        CategoryExample categoryExample = new CategoryExample();
        // 不知道当前页多少，默认为第一页
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // 不知道每页多少条记录，默认为每页5条记录
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        CategoryExample.Criteria c1 = categoryExample.createCriteria();
        if(pageDTO.getParam() != null) {
            CategoryDTO categoryDTO = pageDTO.getParam();
            c1.andNameLike("%" + categoryDTO.getName() + "%");
        }
        categoryExample.setOrderByClause("sort desc, id desc");
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // 分页查出文章分类数据
        List<Category> categoryList = categoryMapper.selectByExample(categoryExample);
        PageInfo<Category> pageInfo = new PageInfo<>(categoryList);
        // 获取数据的总数
        pageDTO.setTotal(pageInfo.getTotal());
        // 讲domain类型数据  转成 DTO类型数据
        List<CategoryDTO> categoryDTOList = CopyUtil.copyList(categoryList, CategoryDTO.class);
        pageDTO.setList(categoryDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * 保存文章分类信息
     * @param categoryDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> saveCategory(CategoryDTO categoryDTO) {
        // 进行统一表单验证
        CodeMsg validate = ValidateEntityUtil.validate(categoryDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        Category category = CopyUtil.copy(categoryDTO, Category.class);
        if(CommonUtil.isEmpty(category.getId())) {
            // 添加操作
            // 判断文章分类名称是否存在
            if(isNameExist(category, "")){
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_NAME_EXIST);
            }
            category.setId(UuidUtil.getShortUuid());
            if(categoryMapper.insertSelective(category) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_ADD_ERROR);
            }
        } else {
            // 修改操作
            // 判断文章分类名称是否存在
            if(isNameExist(category, category.getId())){
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_NAME_EXIST);
            }
            if(categoryMapper.updateByPrimaryKeySelective(category) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_EDIT_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "保存文章分类信息成功！");
    }

    /**
     * 删除文章分类信息
     * @param categoryDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> deleteCategory(CategoryDTO categoryDTO) {
        if(CommonUtil.isEmpty(categoryDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        String[] ids = categoryDTO.getId().split(",");
        for(String id : ids) {
            // 删除文章分类信息
            if(categoryMapper.deleteByPrimaryKey(id) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.CATEGORY_DELETE_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "删除文章分类信息成功！");
    }

    /**
     * 获取所有文章分类数据
     * @return
     */
    @Override
    public ResponseDTO<List<CategoryDTO>> getAllCategoryList() {
        CategoryExample categoryExample = new CategoryExample();
        categoryExample.setOrderByClause("sort desc, id desc");
        List<Category> categoryList = categoryMapper.selectByExample(categoryExample);
        List<CategoryDTO> categoryDTOList = CopyUtil.copyList(categoryList, CategoryDTO.class);
        return ResponseDTO.success(categoryDTOList);
    }

    /**
     * 判断文章分类名称是否重复
     * @param category
     * @param id
     * @return
     */
    public Boolean isNameExist(Category category, String id) {
        CategoryExample categoryExample = new CategoryExample();
        categoryExample.createCriteria().andNameEqualTo(category.getName());
        List<Category> selectedCategoryList = categoryMapper.selectByExample(categoryExample);
        if(selectedCategoryList != null && selectedCategoryList.size() > 0) {
            if(selectedCategoryList.size() > 1){
                return true; //出现重名
            }
            if(!selectedCategoryList.get(0).getId().equals(id)) {
                return true; //出现重名
            }
        }
        return false;//没有重名
    }
}
