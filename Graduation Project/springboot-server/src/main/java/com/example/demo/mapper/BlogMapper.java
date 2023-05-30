package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.DTO.BlogDTO;
import org.springframework.stereotype.Repository;


@Repository
public interface BlogMapper extends BaseMapper<BlogDTO> {
}
