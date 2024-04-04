library(ggplot2)

data1 <- read.csv("/Users/tiago/Desktop/nova experiencia 20DEZ/store-1h-1000-4F-4P/output50.csv")
data2 <- read.csv("/Users/tiago/Desktop/nova experiencia 20DEZ/store-1h-1000-4F-4P/output95.csv")

data <- merge(data1, data2, by = "counter")
colnames(data) <- c("counter", "value1", "value2")



data$counter <- data$counter * 5

theme_set(
  theme_classic() +
    theme(legend.position = "top")
)

p <- ggplot(data, aes(x = counter)) +
  geom_line(aes(y = value1, color = "50th Percentile"), size = 0.7) +
  geom_line(aes(y = value2, color = "95th Percentile"), size = 0.7) +
  geom_point(aes(y = value1, color = "50th Percentile"), size = 0.5) +
  geom_point(aes(y = value2, color = "95th Percentile"), size = 0.5) +
  
  labs(
    x = "Elapsed Time (seconds)",  # Rótulo do eixo x
    y = "Average Response Time (ms)",  # Rótulo do eixo y
    color = "Legend"
  ) +
  
  theme_minimal() +
  scale_color_manual(values = c("50th Percentile" = "#56B4E9", "95th Percentile" = "#999999")) + 
  theme_classic() +
  theme(legend.position = "top")  ## Adiciona a posição da legenda no topo

ggsave("/Users/tiago/Desktop/nova experiencia 20DEZ/store-1h-1000-4F-4P/locust-50-95-store-front.pdf", plot = p, width = 6, height = 3.5, units = "in", dpi = 300)
p
