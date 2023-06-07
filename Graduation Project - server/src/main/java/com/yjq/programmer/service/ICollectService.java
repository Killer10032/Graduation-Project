package com.yjq.programmer.service;

import com.yjq.programmer.dto.CollectDTO;
import com.yjq.programmer.dto.ResponseDTO;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-18 18:40
 */
public interface ICollectService {

    // 判断是否收藏文章
    ResponseDTO<Boolean> judgeCollect(CollectDTO collectDTO);

    // 收藏文章
    ResponseDTO<Boolean> addCollect(CollectDTO collectDTO);

    // 取消收藏文章
    ResponseDTO<Boolean> removeCollect(CollectDTO collectDTO);
}
