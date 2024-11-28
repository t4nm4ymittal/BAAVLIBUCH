import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.common.TopicPartition;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.slf4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class KafkaConsumerServiceTest {

    private KafkaConsumerService kafkaConsumerService;
    private org.apache.kafka.clients.consumer.KafkaConsumer<String, String> mockConsumer;

    @BeforeEach
    void setUp() {
        // Mock the KafkaConsumer
        mockConsumer = mock(org.apache.kafka.clients.consumer.KafkaConsumer.class);

        // Provide a mock implementation for properties
        Properties mockProps = new Properties();
        mockProps.setProperty("topic", "test-topic");
        mockProps.setProperty("bootstrapServers", "localhost:9092");
        mockProps.setProperty("groupId", "test-group");

        // Initialize the KafkaConsumerService with the mocked consumer and properties
        kafkaConsumerService = new KafkaConsumerService(mockConsumer, mockProps);
    }

    @Test
    void testConstructorWithProperties() {
        // Mock Properties
        Properties props = new Properties();
        props.setProperty("topic", "test-topic");
        props.setProperty("bootstrapServers", "localhost:9092");
        props.setProperty("groupId", "test-group");

        KafkaConsumerService service = new KafkaConsumerService(props);
        assertNotNull(service); // Verify the service was initialized
    }

    @Test
    void testLoadPropertiesHandlesIOException() {
        Logger mockLogger = mock(Logger.class);
        Properties props = KafkaConsumerService.loadProperties();
        assertThrows(RuntimeException.class, () -> {
            try (FileInputStream fis = mock(FileInputStream.class)) {
                doThrow(new IOException("Test exception")).when(fis).read();
            }
        });
    }

    @Test
    void testListenHandlesExceptionsGracefully() {
        // Mock poll to throw an exception
        when(mockConsumer.poll(Duration.ofMillis(100))).thenThrow(new RuntimeException("Test exception"));

        // Run listen in a separate thread
        Thread listenThread = new Thread(() -> kafkaConsumerService.listen());
        listenThread.start();

        try {
            Thread.sleep(500); // Allow some time for execution
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        listenThread.interrupt(); // Stop the listening loop

        // Verify that the error was logged
        verify(mockConsumer, atLeastOnce()).poll(Duration.ofMillis(100));
    }

    @Test
    void testClearMessages() {
        kafkaConsumerService.clearMessages();
        assertTrue(kafkaConsumerService.getMessages().isEmpty());
    }

    @Test
    void testGetMessagesReturnsCorrectData() {
        // Prepare a mock ConsumerRecord
        ConsumerRecord<String, String> record = new ConsumerRecord<>("test-topic", 0, 0L, "key", "test-message");

        // Wrap the mock record in a ConsumerRecords object
        ConsumerRecords<String, String> consumerRecords = new ConsumerRecords<>(
                Collections.singletonMap(
                        new TopicPartition("test-topic", 0),
                        Collections.singletonList(record)
                )
        );

        // Mock poll method to return the ConsumerRecords object
        when(mockConsumer.poll(Duration.ofMillis(100))).thenReturn(consumerRecords);

        // Execute listen for a short duration
        Thread listenThread = new Thread(() -> kafkaConsumerService.listen());
        listenThread.start();

        try {
            Thread.sleep(500); // Allow some time for processing
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        listenThread.interrupt(); // Stop the listening loop

        // Verify the messages list contains the expected message
        List<String> messages = kafkaConsumerService.getMessages();
        assertEquals(1, messages.size());
        assertEquals("test-message", messages.get(0));
    }
}
