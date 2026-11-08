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

import hre.dev.springboot_backend.dto.message.MessageRequestDTO;
import hre.dev.springboot_backend.dto.message.MessageResponseDTO;
import hre.dev.springboot_backend.dto.message.MessageUpdateDTO;
import hre.dev.springboot_backend.service.MessageService;

@RestController
@RequestMapping("/api/v1/conversations/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageResponseDTO create(@RequestBody MessageRequestDTO request) {
        return messageService.create(request);
    }

    @GetMapping
    public List<MessageResponseDTO> getAll() {
        return messageService.readAll();
    }

    @GetMapping(params = "authorId")
    public List<MessageResponseDTO> getByAuthorId(@RequestParam Long authorId) {
        return messageService.readAllByAuthorId(authorId);
    }

    @GetMapping(params = "conversationId")
    public List<MessageResponseDTO> getByConversationId(@RequestParam Long conversationId) {
        return messageService.readAllByConversationId(conversationId);
    }

    @PatchMapping("/{id}")
    public MessageResponseDTO changeMessage(
            @PathVariable Long id,
            @RequestBody MessageUpdateDTO request) {
        return messageService.changeMessage(id, request.content());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable Long id) {
        messageService.softDeleteMessageById(id);
    }
}
