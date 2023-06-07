package com.yjq.programmer.service;

import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.dto.TagDTO;
import com.yjq.programmer.dto.TagItemDTO;

import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 14:32
 */
public interface ITagService {

    // 分页获取文章标签数据
    ResponseDTO<PageDTO<TagDTO>> getTagList(PageDTO<TagDTO> pageDTO);

    // 保存文章标签信息
    ResponseDTO<Boolean> saveTag(TagDTO tagDTO);

    // 删除文章标签信息
    ResponseDTO<Boolean> deleteTag(TagDTO tagDTO);

    // 获取所有文章标签数据
    ResponseDTO<List<TagDTO>> getAllTagList();

    // 保存标签详情信息
    ResponseDTO<Boolean> saveTagItem(TagItemDTO tagItemDTO);
}
