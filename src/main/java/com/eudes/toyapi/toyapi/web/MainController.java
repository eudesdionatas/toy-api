package com.eudes.toyapi.toyapi.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @RequestMapping("/saveRDF.html")
    public String saveRDF(){return "saveRDF";}

}
