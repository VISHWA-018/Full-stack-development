package edu.jfs.app;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MVCController {

    @GetMapping("/")
    public ModelAndView getMyPage() {
        ModelAndView mView = new ModelAndView();
        mView.addObject("VTU26402", "VISWA");
        mView.setViewName("OneString");
        return mView;
    }

    @GetMapping("/person")
    public ModelAndView getMyPersonData() {
        ModelAndView mView = new ModelAndView();
        Person person = new Person(26402, "VISWA");
        mView.addObject("str", person.getNameString());
        mView.setViewName("OneString");
        return mView;
    }

    @GetMapping("/page")
    public ModelAndView page() {
        return new ModelAndView("index");
    }

    @GetMapping("/show")
    public String show(Model model) {
        Person person = new Person(24402, "VISWA");
        model.addAttribute("person", person);
        return "Person";
    }
}