package com.yjq.programmer.controller.web;

import com.yjq.programmer.dto.CollectDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.ICollectService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-18 18:39
 */
@RestController("WebCollectController")
@RequestMapping("/web/collect")
public class CollectController {

    @Resource
    private ICollectService collectService;

    /**
     * 判断是否收藏文章
     * @param collectDTO
     * @return
     */
    @PostMapping("/judge")
    public ResponseDTO<Boolean> judgeCollect(@RequestBody CollectDTO collectDTO){
        return collectService.judgeCollect(collectDTO);
    }

    /**
     * 收藏文章
     * @param collectDTO
     * @return
     */
    @PostMapping("/add")
    public ResponseDTO<Boolean> addCollect(@RequestBody CollectDTO collectDTO){
        return collectService.addCollect(collectDTO);
    }

    /**
     * 取消收藏文章
     * @param collectDTO
     * @return
     */
    @PostMapping("/remove")
    public ResponseDTO<Boolean> removeCollect(@RequestBody CollectDTO collectDTO){
        return collectService.removeCollect(collectDTO);
    }


}
