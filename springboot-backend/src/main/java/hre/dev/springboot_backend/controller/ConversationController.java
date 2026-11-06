package hre.dev.springboot_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import hre.dev.springboot_backend.dto.ConversationRequestDTO;
import hre.dev.springboot_backend.dto.ConversationResponseDTO;
import hre.dev.springboot_backend.service.ConversationService;

@RestController
@RequestMapping("/api/v1/conversations")
public class ConversationController {

    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ConversationResponseDTO create(@RequestBody ConversationRequestDTO request) {
        return conversationService.create(request);
    }

    @GetMapping
    public List<ConversationResponseDTO> getAll() {
        return conversationService.readAll();
    }

    @GetMapping(params = "creatorId")
    public List<ConversationResponseDTO> getByCreatorId(@RequestParam Long creatorId) {
        return conversationService.readAllByCreatorId(creatorId);
    }

    @GetMapping(params = "title")
    public List<ConversationResponseDTO> findByTitle(@RequestParam String title) {
        return conversationService.readAllContainingString(title);
    }

    @PatchMapping("/{id}")
    public ConversationResponseDTO changeTitle(
            @PathVariable Long id,
            @RequestBody ConversationRequestDTO request) {
        return conversationService.changeName(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        conversationService.deleteById(id);
    }
}
