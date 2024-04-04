library(ggplot2)

data <- read.csv("/Users/tiago/Desktop/nova experiencia 20DEZ/store-1h-1000-4F-4P/output50.csv")
data$counter <- data$counter * 5

theme_set(
  theme_classic() +
    theme(legend.position = "top")
)

# Plot the data using ggplot2
p <- ggplot(data, aes(x = counter, y = value, color = "50th Percentile")) +
  geom_line(size = 0.7) +
  geom_point(size = 0.5) +
  
  labs(
    x = "Elapsed Time (seconds)",  # Rótulo do eixo x
    y = "Average Response Time (ms)",  # Rótulo do eixo y
    color = "Legend"
  ) +
  
  theme_minimal() +
  scale_color_manual(values = c("50th Percentile" = "#56B4E9")) + ##50C878
  theme_classic() +
  theme(legend.position = "top")  ## Adiciona a posição da legenda no topo

ggsave("/Users/tiago/Desktop/nova experiencia 20DEZ/store-1h-1000-4F-4P/locust-50-store-front.pdf", plot = p, width = 6, height = 3.5, units = "in", dpi = 300)
print(p)
