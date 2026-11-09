package hre.dev.springboot_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hre.dev.springboot_backend.dto.message.MessageRequestDTO;
import hre.dev.springboot_backend.dto.message.MessageResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Conversation;
import hre.dev.springboot_backend.model.Message;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.repository.ConversationRepository;
import hre.dev.springboot_backend.repository.MessageRepository;
import hre.dev.springboot_backend.repository.UserRepository;

@Service
@Transactional(readOnly = true)
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;

    public MessageService(
            MessageRepository messageRepository,
            UserRepository userRepository,
            ConversationRepository conversationRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.conversationRepository = conversationRepository;
    }

    private List<MessageResponseDTO> mapToResponseDTOList(List<Message> messages) {
        return messages.stream()
                .map(MessageResponseDTO::mapToDTO)
                .toList();
    }

    private User findActiveAuthorById(Long authorId) {
        return userRepository.findByIdAndIsActiveTrue(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Conversation findActiveConversationById(Long conversationId) {
        return conversationRepository.findByIdAndIsActiveTrue(conversationId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));
    }

    private Message findActiveMessageById(Long messageId) {
        return messageRepository.findByIdAndIsActiveTrue(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found"));
    }

    @Transactional
    public MessageResponseDTO create(MessageRequestDTO request) {
        User author = findActiveAuthorById(request.authorId());
        Conversation conversation = findActiveConversationById(request.conversationId());

        Message message = new Message(author, conversation, request.content());
        Message saved = messageRepository.save(message);

        return MessageResponseDTO.mapToDTO(saved);
    }

    public List<MessageResponseDTO> readAll() {
        List<Message> messages = messageRepository.findAllByIsActiveTrue();

        return mapToResponseDTOList(messages);
    }

    public List<MessageResponseDTO> readAllByAuthorId(Long authorId) {
        findActiveAuthorById(authorId);

        List<Message> messages = messageRepository
                .findAllByAuthor_IdAndIsActiveTrue(authorId);

        return mapToResponseDTOList(messages);
    }

    public List<MessageResponseDTO> readAllByConversationId(Long conversationId) {
        findActiveConversationById(conversationId);

        List<Message> messages = messageRepository
                .findAllByConversation_IdAndIsActiveTrue(conversationId);

        return mapToResponseDTOList(messages);
    }

    @Transactional
    public MessageResponseDTO changeMessage(Long messageId, String content) {
        Message message = findActiveMessageById(messageId);

        message.setContent(content);

        return MessageResponseDTO.mapToDTO(message);
    }

    @Transactional
    public void softDeleteMessageById(Long messageId) {
        Message message = findActiveMessageById(messageId);

        message.softDelete();
    }
}
