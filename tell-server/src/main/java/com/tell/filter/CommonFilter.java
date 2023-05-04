package com.tell.filter;

import com.tell.util.IpUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

/**
 * 统计每个请求执行的时间
 */
@Component
public class CommonFilter implements HandlerInterceptor{

    private Logger log = LoggerFactory.getLogger(CommonFilter.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        long start = System.currentTimeMillis();
        request.setAttribute("_start", start);
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
        long start = (long) request.getAttribute("_start");
        String actionName = request.getRequestURI();
        String clientIp = IpUtil.getIpAddr(request);
        StringBuilder logString = new StringBuilder();
        logString.append(clientIp).append("|").append(actionName).append("|");
        Map<String, String[]> params = request.getParameterMap();
        params.forEach((key, value) -> {
            logString.append(key);
            logString.append("=");
            for (String paramString : value) {
                logString.append(paramString);
            }
            logString.append("|");
        });
        long executionTime = System.currentTimeMillis() - start;
        logString.append("excitation=").append(executionTime).append("ms");
        log.info(logString.toString());
    }
}
