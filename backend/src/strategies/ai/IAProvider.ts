export interface IAProvider {
    analyzeRide(prompt: string, cityContext: string): Promise<{
      car_type: string;
      destination_name: string;
    }>;
  }