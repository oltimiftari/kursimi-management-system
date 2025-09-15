package in.oltimiftari.kursimi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class KursimiApplication {

	public static void main(String[] args) {
		SpringApplication.run(KursimiApplication.class, args);
	}

}
