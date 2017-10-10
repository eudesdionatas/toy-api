package com.eudes.toyapi.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/MakeModel")
    public String saveRDF2() {
        return "makeModel";
    }

    @GetMapping("/SaveFromModelRDF")
    public String saveFromRDFModel() {
        return "saveFromModelRDF";
    }

    @GetMapping("/SaveFromModelRDF2")
    public String saveFromRDFModel2() {
        return "saveFromModelRDF2";
    }

    @GetMapping("/SaveRDF")
    public String saveRDF() {
        return "saveRDF";
    }

}
