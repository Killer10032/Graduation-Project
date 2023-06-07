package com.yjq.programmer.dao.my;

import org.apache.ibatis.annotations.Param;

import java.util.Map;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-25 10:48
 */
public interface MyArticleMapper {

    // 根据时间范围获取文章数
    Integer getArticleTotalByDate(@Param("queryMap") Map<String, Object> queryMap);
}
