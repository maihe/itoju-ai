import { ClearJourneyUseCase } from "@/application/ClearJourneyUseCase";
import { LoadJourneyUseCase } from "@/application/LoadJourneyUseCase";
import { SendChatMessageUseCase } from "@/application/SendChatMessageUseCase";
import type { AIService } from "@/domain/ports/AIService";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";
import type { UserProfileRepository } from "@/domain/ports/UserProfileRepository";
import { PrototypeCompanionAIService } from "@/infrastructure/ai/PrototypeCompanionAIService";
import { LocalStorageJourneyRepository } from "@/infrastructure/storage/LocalStorageJourneyRepository";
import { LocalStorageUserProfileRepository } from "@/infrastructure/storage/LocalStorageUserProfileRepository";

/**
 * Composition root do Companion.
 *
 * É o ÚNICO lugar que sabe quais implementações concretas de cada
 * porta estão em uso. Trocar `EchoAIService` por um LLM real ou
 * `LocalStorageJourneyRepository` por um backend remoto é uma mudança
 * localizada aqui.
 */
export interface CompanionContainer {
  ai: AIService;
  journeyRepository: JourneyRepository;
  profileRepository: UserProfileRepository;
  useCases: {
    loadJourney: LoadJourneyUseCase;
    clearJourney: ClearJourneyUseCase;
    sendChatMessage: SendChatMessageUseCase;
  };
}

let cached: CompanionContainer | null = null;

export function getContainer(): CompanionContainer {
  if (cached) return cached;

  const ai: AIService = new PrototypeCompanionAIService();
  const journeyRepository: JourneyRepository = new LocalStorageJourneyRepository();
  const profileRepository: UserProfileRepository = new LocalStorageUserProfileRepository();

  cached = {
    ai,
    journeyRepository,
    profileRepository,
    useCases: {
      loadJourney: new LoadJourneyUseCase(journeyRepository),
      clearJourney: new ClearJourneyUseCase(journeyRepository),
      sendChatMessage: new SendChatMessageUseCase(ai, journeyRepository),
    },
  };
  return cached;
}
