import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

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
    void testListenMethodProcessesMessages() {
        // Prepare a mock ConsumerRecord
        ConsumerRecord<String, String> record = new ConsumerRecord<>("test-topic", 0, 0L, "key", "test-message");

        // Wrap the mock record in a ConsumerRecords object
        ConsumerRecords<String, String> consumerRecords = new ConsumerRecords<>(
                Collections.singletonMap(
                        new org.apache.kafka.common.TopicPartition("test-topic", 0),
                        Collections.singletonList(record)
                )
        );

        // Mock poll method to return the ConsumerRecords object
        when(mockConsumer.poll(Duration.ofMillis(100))).thenReturn(consumerRecords);

        // Execute the listen method for a short duration
        Thread listenThread = new Thread(() -> kafkaConsumerService.listen());
        listenThread.start();

        try {
            Thread.sleep(500); // Allow some time for processing
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        listenThread.interrupt(); // Stop the listening loop

        // Verify that the messages list contains the message
        assert kafkaConsumerService.getMessages().contains("test-message");
    }
}
