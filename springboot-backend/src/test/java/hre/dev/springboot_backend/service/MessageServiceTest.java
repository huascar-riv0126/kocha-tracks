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

import hre.dev.springboot_backend.dto.message.MessageRequestDTO;
import hre.dev.springboot_backend.dto.message.MessageResponseDTO;
import hre.dev.springboot_backend.exception.ResourceNotFoundException;
import hre.dev.springboot_backend.model.Conversation;
import hre.dev.springboot_backend.model.Message;
import hre.dev.springboot_backend.model.User;
import hre.dev.springboot_backend.repository.ConversationRepository;
import hre.dev.springboot_backend.repository.MessageRepository;
import hre.dev.springboot_backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class MessageServiceTest {

    @Mock
    private MessageRepository messageRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ConversationRepository conversationRepository;

    @InjectMocks
    private MessageService messageService;

    private User author;
    private Conversation conversation;
    private Message message;

    @BeforeEach
    void setUp() {
        author = new User("lucia", "pass", "USER");
        author.setId(10L);

        conversation = new Conversation(author, "Avenida Heroinas");
        ReflectionTestUtils.setField(conversation, "id", 20L);

        message = new Message(author, conversation, "Trafico detenido por marcha");
        ReflectionTestUtils.setField(message, "id", 30L);
    }

    @Test
    @DisplayName("create() creates and returns message when author and conversation are active")
    void testCreate_success() {
        MessageRequestDTO request = new MessageRequestDTO(10L, 20L, "Trafico detenido por marcha");
        when(userRepository.findByIdAndIsActiveTrue(10L)).thenReturn(Optional.of(author));
        when(conversationRepository.findByIdAndIsActiveTrue(20L)).thenReturn(Optional.of(conversation));
        when(messageRepository.save(any(Message.class))).thenReturn(message);

        MessageResponseDTO response = messageService.create(request);

        assertThat(response.id()).isEqualTo(30L);
        assertThat(response.content()).isEqualTo("Trafico detenido por marcha");
        verify(messageRepository).save(any(Message.class));
    }

    @Test
    @DisplayName("create() throws ResourceNotFoundException when author not found")
    void testCreate_authorNotFound() {
        MessageRequestDTO request = new MessageRequestDTO(99L, 20L, "Contenido");
        when(userRepository.findByIdAndIsActiveTrue(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> messageService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    @DisplayName("create() throws ResourceNotFoundException when conversation not found")
    void testCreate_conversationNotFound() {
        MessageRequestDTO request = new MessageRequestDTO(10L, 999L, "Contenido");
        when(userRepository.findByIdAndIsActiveTrue(10L)).thenReturn(Optional.of(author));
        when(conversationRepository.findByIdAndIsActiveTrue(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> messageService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Conversation not found");
    }

    @Test
    @DisplayName("readAll() returns active messages")
    void testReadAll() {
        when(messageRepository.findAllByIsActiveTrue()).thenReturn(List.of(message));

        List<MessageResponseDTO> list = messageService.readAll();

        assertThat(list).hasSize(1);
        assertThat(list.get(0).id()).isEqualTo(30L);
        verify(messageRepository).findAllByIsActiveTrue();
    }

    @Test
    @DisplayName("readAllByAuthorId() returns messages for active author")
    void testReadAllByAuthorId() {
        when(userRepository.findByIdAndIsActiveTrue(10L)).thenReturn(Optional.of(author));
        when(messageRepository.findAllByAuthor_IdAndIsActiveTrue(10L)).thenReturn(List.of(message));

        List<MessageResponseDTO> list = messageService.readAllByAuthorId(10L);

        assertThat(list).hasSize(1);
        verify(messageRepository).findAllByAuthor_IdAndIsActiveTrue(10L);
    }

    @Test
    @DisplayName("readAllByConversationId() returns messages for active conversation")
    void testReadAllByConversationId() {
        when(conversationRepository.findByIdAndIsActiveTrue(20L)).thenReturn(Optional.of(conversation));
        when(messageRepository.findAllByConversation_IdAndIsActiveTrue(20L)).thenReturn(List.of(message));

        List<MessageResponseDTO> list = messageService.readAllByConversationId(20L);

        assertThat(list).hasSize(1);
        verify(messageRepository).findAllByConversation_IdAndIsActiveTrue(20L);
    }

    @Test
    @DisplayName("changeMessage() updates message content")
    void testChangeMessage() {
        when(messageRepository.findByIdAndIsActiveTrue(30L)).thenReturn(Optional.of(message));

        MessageResponseDTO response = messageService.changeMessage(30L, "Trafico normalizado");

        assertThat(response.content()).isEqualTo("Trafico normalizado");
        assertThat(message.getContent()).isEqualTo("Trafico normalizado");
    }

    @Test
    @DisplayName("softDeleteMessageById() marks message as inactive and deleted")
    void testSoftDeleteMessageById() {
        when(messageRepository.findByIdAndIsActiveTrue(30L)).thenReturn(Optional.of(message));

        messageService.softDeleteMessageById(30L);

        assertThat(message.getIsActive()).isFalse();
        assertThat(message.getDeletedAt()).isNotNull();
    }
}

