package com.eudes.toyapi.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/saveRDF")
    public String saveRDF() {
        return "saveRDF";
    }

    @GetMapping("/MakeModel")
    public String saveRDF2() {
        return "makeModel";
    }

}
