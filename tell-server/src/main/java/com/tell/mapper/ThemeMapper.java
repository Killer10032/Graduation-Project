package com.tell.mapper;

import com.tell.model.Theme;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

// 主题实体类的映射

@Mapper
public interface ThemeMapper {

    /**
     * 查询所有主题
     * @param pageNo
     * @param pageSize
     * @return
     */
    List<Theme> findThemeAll(@Param("pageNo") Integer pageNo, @Param("pageSize") Integer pageSize);
}
