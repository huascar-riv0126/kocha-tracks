package hre.dev.springboot_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import hre.dev.springboot_backend.dto.conversation.ConversationRequestDTO;
import hre.dev.springboot_backend.dto.conversation.ConversationResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Conversation;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.repository.ConversationRepository;
import hre.dev.springboot_backend.repository.UserRepository;

@Service
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public ConversationService(
            ConversationRepository conversationRepository,
            UserRepository userRepository) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    private List<ConversationResponseDTO> mapToResponseDTOList(List<Conversation> conversations) {
        return conversations.stream()
                .map(ConversationResponseDTO::mapToDTO)
                .toList();
    }

    private User findActiveUserById(Long userId) {
        return userRepository.findByIdAndIsActiveTrue(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public ConversationResponseDTO create(ConversationRequestDTO request) {
        User creator = findActiveUserById(request.creatorId());

        Conversation conversation = new Conversation(creator, request.name());
        Conversation saved = conversationRepository.save(conversation);

        return ConversationResponseDTO.mapToDTO(saved);
    }

    public List<ConversationResponseDTO> readAll() {
        List<Conversation> conversations = conversationRepository.findAllByIsActiveTrue();

        return mapToResponseDTOList(conversations);
    }

    public List<ConversationResponseDTO> readAllByCreatorId(Long creatorId) {
        List<Conversation> conversations = conversationRepository
                .findAllByCreator_IdAndIsActiveTrue(creatorId);

        return mapToResponseDTOList(conversations);
    }

    public List<ConversationResponseDTO> readAllContainingString(String substring) {
        List<Conversation> conversations = conversationRepository
                .findByNameContainingIgnoreCase(substring);

        return mapToResponseDTOList(conversations);
    }

    public ConversationResponseDTO changeName(Long id, ConversationRequestDTO request) {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        conversation.setName(request.name());

        Conversation updated = conversationRepository.save(conversation);

        return ConversationResponseDTO.mapToDTO(updated);
    }

    public void deleteById(Long id) {
        Conversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conversation not found"));

        conversation.softDelete();
        conversationRepository.save(conversation);
    }
}
