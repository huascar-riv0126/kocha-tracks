package hre.dev.springboot_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import hre.dev.springboot_backend.dto.conversation.ConversationRequestDTO;
import hre.dev.springboot_backend.dto.conversation.ConversationResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Conversation;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.repository.ConversationRepository;
import hre.dev.springboot_backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ConversationServiceTest {

    @Mock
    private ConversationRepository conversationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ConversationService conversationService;

    private User creator;
    private Conversation conversation;

    @BeforeEach
    void setUp() {
        creator = new User("pedro", "pass", "USER");
        creator.setId(5L);

        conversation = new Conversation(creator, "Alerta Climatica");
        ReflectionTestUtils.setField(conversation, "id", 100L);
    }

    @Test
    @DisplayName("create() creates and returns conversation when user is active")
    void testCreate_success() {
        ConversationRequestDTO request = new ConversationRequestDTO(5L, "Alerta Climatica");
        when(userRepository.findByIdAndIsActiveTrue(5L)).thenReturn(Optional.of(creator));
        when(conversationRepository.save(any(Conversation.class))).thenReturn(conversation);

        ConversationResponseDTO result = conversationService.create(request);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(100L);
        assertThat(result.userId()).isEqualTo(5L);
        assertThat(result.name()).isEqualTo("Alerta Climatica");
        verify(conversationRepository).save(any(Conversation.class));
    }

    @Test
    @DisplayName("create() throws ResourceNotFoundException when creator is not found or inactive")
    void testCreate_userNotFound() {
        ConversationRequestDTO request = new ConversationRequestDTO(99L, "Cortes de Luz");
        when(userRepository.findByIdAndIsActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> conversationService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("readAll() returns active conversations")
    void testReadAll() {
        when(conversationRepository.findAllByIsActiveTrue()).thenReturn(List.of(conversation));

        List<ConversationResponseDTO> list = conversationService.readAll();

        assertThat(list).hasSize(1);
        assertThat(list.get(0).id()).isEqualTo(100L);
        verify(conversationRepository).findAllByIsActiveTrue();
    }

    @Test
    @DisplayName("readAllByCreatorId() returns conversations by creator")
    void testReadAllByCreatorId() {
        when(conversationRepository.findAllByCreator_IdAndIsActiveTrue(5L)).thenReturn(List.of(conversation));

        List<ConversationResponseDTO> list = conversationService.readAllByCreatorId(5L);

        assertThat(list).hasSize(1);
        verify(conversationRepository).findAllByCreator_IdAndIsActiveTrue(5L);
    }

    @Test
    @DisplayName("readAllContainingString() returns conversations matching substring")
    void testReadAllContainingString() {
        when(conversationRepository.findByNameContainingIgnoreCase("Clima")).thenReturn(List.of(conversation));

        List<ConversationResponseDTO> list = conversationService.readAllContainingString("Clima");

        assertThat(list).hasSize(1);
        verify(conversationRepository).findByNameContainingIgnoreCase("Clima");
    }

    @Test
    @DisplayName("changeName() updates the name of conversation")
    void testChangeName_success() {
        ConversationRequestDTO request = new ConversationRequestDTO(5L, "Tormenta Electrica Actualizada");
        when(conversationRepository.findById(100L)).thenReturn(Optional.of(conversation));
        when(conversationRepository.save(any(Conversation.class))).thenReturn(conversation);

        ConversationResponseDTO updated = conversationService.changeName(100L, request);

        assertThat(updated.name()).isEqualTo("Tormenta Electrica Actualizada");
        verify(conversationRepository).save(conversation);
    }

    @Test
    @DisplayName("changeName() throws ResourceNotFoundException when conversation not found")
    void testChangeName_notFound() {
        ConversationRequestDTO request = new ConversationRequestDTO(5L, "Nuevo Nombre");
        when(conversationRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> conversationService.changeName(999L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Conversation not found");
    }

    @Test
    @DisplayName("deleteById() soft-deletes the conversation")
    void testDeleteById_success() {
        when(conversationRepository.findById(100L)).thenReturn(Optional.of(conversation));

        conversationService.deleteById(100L);

        verify(conversationRepository).save(conversation);
    }
}

