package com.yjq.programmer.controller.web;

import com.yjq.programmer.dto.AttentionDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.IAttentionService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-22 10:43
 */
@RestController("WebAttentionController")
@RequestMapping("/web/attention")
public class AttentionController {

    @Resource
    private IAttentionService attentionService;

    /**
     * 关注用户操作
     * @param attentionDTO
     * @return
     */
    @PostMapping("/add")
    public ResponseDTO<Boolean> addAttention(@RequestBody AttentionDTO attentionDTO){
        return attentionService.addAttention(attentionDTO);
    }

    /**
     * 取消关注用户操作
     * @param attentionDTO
     * @return
     */
    @PostMapping("/remove")
    public ResponseDTO<Boolean> removeAttention(@RequestBody AttentionDTO attentionDTO){
        return attentionService.removeAttention(attentionDTO);
    }

    /**
     * 判断是否关注
     * @param attentionDTO
     * @return
     */
    @PostMapping("/judge")
    public ResponseDTO<Boolean> judgeAttention(@RequestBody AttentionDTO attentionDTO){
        return attentionService.judgeAttention(attentionDTO);
    }

    /**
     * 分页获取关注和粉丝数据
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<AttentionDTO>> getAttentionList(@RequestBody PageDTO<AttentionDTO> pageDTO){
        return attentionService.getAttentionList(pageDTO);
    }

    /**
     * 获取全部关注和粉丝数据
     * @param attentionDTO
     * @return
     */
    @PostMapping("/all")
    public ResponseDTO<List<AttentionDTO>> getAllAttentionList(@RequestBody AttentionDTO attentionDTO){
        return attentionService.getAllAttentionList(attentionDTO);
    }
}
