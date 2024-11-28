import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Collections;
import java.util.List;

public class KafkaConsumerServiceTest {

    @Mock
    private KafkaConsumer<String, String> mockConsumer;

    @InjectMocks
    private KafkaConsumerService kafkaConsumerService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testKafkaConsumerServiceInitialization() {
        // Verify the initialization works correctly
        assertNotNull(kafkaConsumerService);
    }

    @Test
    public void testListenShouldProcessMessages() {
        // Arrange
        String expectedMessage = "Test message";
        ConsumerRecord<String, String> record = new ConsumerRecord<>("topic", 0, 0, "key", expectedMessage);
        when(mockConsumer.poll(any())).thenReturn(Collections.singletonList(record));

        // Act
        kafkaConsumerService.listen();

        // Assert
        List<String> messages = kafkaConsumerService.getMessages();
        assertEquals(1, messages.size());
        assertEquals(expectedMessage, messages.get(0));
    }

    @Test
    public void testListenShouldHandleExceptions() {
        // Arrange: simulate an exception while processing messages
        when(mockConsumer.poll(any())).thenThrow(new RuntimeException("Kafka poll error"));

        // Act and Assert
        assertDoesNotThrow(() -> kafkaConsumerService.listen());
    }

    @Test
    public void testGetMessages() {
        // Arrange
        String message1 = "Message 1";
        String message2 = "Message 2";
        kafkaConsumerService.getMessages().add(message1);
        kafkaConsumerService.getMessages().add(message2);

        // Act
        List<String> messages = kafkaConsumerService.getMessages();

        // Assert
        assertEquals(2, messages.size());
        assertTrue(messages.contains(message1));
        assertTrue(messages.contains(message2));
    }

    @Test
    public void testClearMessages() {
        // Arrange
        kafkaConsumerService.getMessages().add("Message to clear");

        // Act
        kafkaConsumerService.clearMessages();

        // Assert
        assertTrue(kafkaConsumerService.getMessages().isEmpty());
    }

    @Test
    public void testErrorLoadingPropertiesFile() {
        // Simulate file loading failure by mocking the FileInputStream
        FileInputStream mockFis = mock(FileInputStream.class);
        doThrow(new IOException("File not found")).when(mockFis).close();

        // Assert that it throws a RuntimeException due to file loading failure
        assertThrows(RuntimeException.class, () -> new KafkaConsumerService());
    }

    @Test
    public void testConsumerSubscribesToTopic() {
        // Arrange
        Properties mockProps = mock(Properties.class);
        when(mockProps.getProperty("bootstrapServers")).thenReturn("localhost:9092");
        when(mockProps.getProperty("groupId")).thenReturn("testGroup");

        // Act
        KafkaConsumerService service = new KafkaConsumerService();

        // Assert: Check that the consumer subscribes to the correct topic
        verify(mockConsumer).subscribe(Collections.singletonList("topic"));
    }
}
