package com.yjq.programmer.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yjq.programmer.bean.CodeMsg;
import com.yjq.programmer.dao.TagItemMapper;
import com.yjq.programmer.dao.TagMapper;
import com.yjq.programmer.domain.Tag;
import com.yjq.programmer.domain.TagExample;
import com.yjq.programmer.domain.TagItem;
import com.yjq.programmer.domain.TagItemExample;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.dto.TagDTO;
import com.yjq.programmer.dto.TagItemDTO;
import com.yjq.programmer.service.ITagService;
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
 * @create 2023-02-16 14:32
 */
@Service
@Transactional
public class TagServiceImpl implements ITagService {

    @Resource
    private TagMapper tagMapper;

    @Resource
    private TagItemMapper tagItemMapper;

    /**
     * 分页获取文章标签数据
     * @param pageDTO
     * @return
     */
    @Override
    public ResponseDTO<PageDTO<TagDTO>> getTagList(PageDTO<TagDTO> pageDTO) {
        TagExample tagExample = new TagExample();
        // 不知道当前页多少，默认为第一页
        if(pageDTO.getPage() == null){
            pageDTO.setPage(1);
        }
        // 不知道每页多少条记录，默认为每页5条记录
        if(pageDTO.getSize() == null){
            pageDTO.setSize(5);
        }
        TagExample.Criteria c1 = tagExample.createCriteria();
        if(pageDTO.getParam() != null) {
            TagDTO tagDTO = pageDTO.getParam();
            c1.andNameLike("%" + tagDTO.getName() + "%");
        }
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getSize());
        // 分页查出文章标签数据
        List<Tag> tagList = tagMapper.selectByExample(tagExample);
        PageInfo<Tag> pageInfo = new PageInfo<>(tagList);
        // 获取数据的总数
        pageDTO.setTotal(pageInfo.getTotal());
        // 讲domain类型数据  转成 DTO类型数据
        List<TagDTO> tagDTOList = CopyUtil.copyList(tagList, TagDTO.class);
        pageDTO.setList(tagDTOList);
        return ResponseDTO.success(pageDTO);
    }

    /**
     * 保存文章标签信息
     * @param tagDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> saveTag(TagDTO tagDTO) {
        // 进行统一表单验证
        CodeMsg validate = ValidateEntityUtil.validate(tagDTO);
        if (!validate.getCode().equals(CodeMsg.SUCCESS.getCode())) {
            return ResponseDTO.errorByMsg(validate);
        }
        Tag tag = CopyUtil.copy(tagDTO, Tag.class);
        if(CommonUtil.isEmpty(tag.getId())) {
            // 添加操作
            // 判断文章标签名称是否存在
            if(isNameExist(tag, "")){
                return ResponseDTO.errorByMsg(CodeMsg.TAG_NAME_EXIST);
            }
            tag.setId(UuidUtil.getShortUuid());
            if(tagMapper.insertSelective(tag) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.TAG_ADD_ERROR);
            }
        } else {
            // 修改操作
            // 判断文章标签名称是否存在
            if(isNameExist(tag, tag.getId())){
                return ResponseDTO.errorByMsg(CodeMsg.TAG_NAME_EXIST);
            }
            if(tagMapper.updateByPrimaryKeySelective(tag) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.TAG_EDIT_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "保存文章标签信息成功！");
    }

    /**
     * 删除文章标签信息
     * @param tagDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> deleteTag(TagDTO tagDTO) {
        if(CommonUtil.isEmpty(tagDTO.getId())) {
            return ResponseDTO.errorByMsg(CodeMsg.DATA_ERROR);
        }
        String[] ids = tagDTO.getId().split(",");
        for(String id : ids) {
            // 删除标签详情信息
            TagItemExample tagItemExample = new TagItemExample();
            tagItemExample.createCriteria().andTagIdEqualTo(id);
            tagItemMapper.deleteByExample(tagItemExample);
            // 删除文章标签信息
            if(tagMapper.deleteByPrimaryKey(id) == 0) {
                return ResponseDTO.errorByMsg(CodeMsg.TAG_DELETE_ERROR);
            }
        }
        return ResponseDTO.successByMsg(true, "删除文章标签信息成功！");
    }

    /**
     * 获取所有文章标签数据
     * @return
     */
    @Override
    public ResponseDTO<List<TagDTO>> getAllTagList() {
        TagExample tagExample = new TagExample();
        List<Tag> tagList = tagMapper.selectByExample(tagExample);
        List<TagDTO> tagDTOList = CopyUtil.copyList(tagList, TagDTO.class);
        return ResponseDTO.success(tagDTOList);
    }

    /**
     * 保存标签详情信息
     * @param tagItemDTO
     * @return
     */
    @Override
    public ResponseDTO<Boolean> saveTagItem(TagItemDTO tagItemDTO) {
        if(CommonUtil.isEmpty(tagItemDTO.getArticleId())) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_NOT_EXIST);
        }
        if(tagItemDTO.getTagIdList() == null || tagItemDTO.getTagIdList().length == 0) {
            return ResponseDTO.errorByMsg(CodeMsg.ARTICLE_TAG_EMPTY);
        }
        // 先删除该文章的所有标签
        TagItemExample tagItemExample = new TagItemExample();
        tagItemExample.createCriteria().andArticleIdEqualTo(tagItemDTO.getArticleId());
        tagItemMapper.deleteByExample(tagItemExample);
        // 然后保存最新的文章标签
        for(String tagId: tagItemDTO.getTagIdList()) {
            TagItem tagItem = new TagItem();
            tagItem.setId(UuidUtil.getShortUuid());
            tagItem.setArticleId(tagItemDTO.getArticleId());
            tagItem.setTagId(tagId);
            tagItemMapper.insertSelective(tagItem);
        }
        return ResponseDTO.successByMsg(true, "保存标签详情信息成功！");
    }

    /**
     * 判断文章标签名称是否重复
     * @param tag
     * @param id
     * @return
     */
    public Boolean isNameExist(Tag tag, String id) {
        TagExample tagExample = new TagExample();
        tagExample.createCriteria().andNameEqualTo(tag.getName());
        List<Tag> selectedTagList = tagMapper.selectByExample(tagExample);
        if(selectedTagList != null && selectedTagList.size() > 0) {
            if(selectedTagList.size() > 1){
                return true; //出现重名
            }
            if(!selectedTagList.get(0).getId().equals(id)) {
                return true; //出现重名
            }
        }
        return false;//没有重名
    }
}
