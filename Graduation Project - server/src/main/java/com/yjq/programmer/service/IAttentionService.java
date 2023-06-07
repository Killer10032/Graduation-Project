package com.yjq.programmer.service;

import com.yjq.programmer.dto.AttentionDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;

import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-22 10:45
 */
public interface IAttentionService {

    // 关注用户操作
    ResponseDTO<Boolean> addAttention(AttentionDTO attentionDTO);

    // 取消关注用户操作
    ResponseDTO<Boolean> removeAttention(AttentionDTO attentionDTO);

    // 判断是否关注
    ResponseDTO<Boolean> judgeAttention(AttentionDTO attentionDTO);

    // 分页获取关注和粉丝数据
    ResponseDTO<PageDTO<AttentionDTO>> getAttentionList(PageDTO<AttentionDTO> pageDTO);

    // 获取全部关注和粉丝数据
    ResponseDTO<List<AttentionDTO>> getAllAttentionList(AttentionDTO attentionDTO);
}
