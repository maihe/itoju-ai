import { ClearJourneyUseCase } from "@/application/ClearJourneyUseCase";
import { ContextEngine } from "@/application/ContextEngine";
import { LoadJourneyUseCase } from "@/application/LoadJourneyUseCase";
import { LoadMemoriesUseCase } from "@/application/LoadMemoriesUseCase";
import { SendChatMessageUseCase } from "@/application/SendChatMessageUseCase";
import type { AIService } from "@/domain/ports/AIService";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";
import type { MemoryRepository } from "@/domain/ports/MemoryRepository";
import type { UserProfileRepository } from "@/domain/ports/UserProfileRepository";
import { PrototypeCompanionAIService } from "@/infrastructure/ai/PrototypeCompanionAIService";
import { LocalStorageJourneyRepository } from "@/infrastructure/storage/LocalStorageJourneyRepository";
import { LocalStorageMemoryRepository } from "@/infrastructure/storage/LocalStorageMemoryRepository";
import { LocalStorageUserProfileRepository } from "@/infrastructure/storage/LocalStorageUserProfileRepository";

/**
 * Composition root do Companion.
 *
 * É o ÚNICO lugar que sabe quais implementações concretas de cada
 * porta estão em uso. Trocar `PrototypeCompanionAIService` por um LLM
 * real ou `LocalStorage*Repository` por um backend remoto é uma
 * mudança localizada aqui.
 */
export interface CompanionContainer {
  ai: AIService;
  journeyRepository: JourneyRepository;
  profileRepository: UserProfileRepository;
  memoryRepository: MemoryRepository;
  useCases: {
    loadJourney: LoadJourneyUseCase;
    clearJourney: ClearJourneyUseCase;
    sendChatMessage: SendChatMessageUseCase;
    loadMemories: LoadMemoriesUseCase;
  };
}

let cached: CompanionContainer | null = null;

export function getContainer(): CompanionContainer {
  if (cached) return cached;

  const ai: AIService = new PrototypeCompanionAIService();
  const journeyRepository: JourneyRepository = new LocalStorageJourneyRepository();
  const profileRepository: UserProfileRepository = new LocalStorageUserProfileRepository();
  const memoryRepository: MemoryRepository = new LocalStorageMemoryRepository();

  cached = {
    ai,
    journeyRepository,
    profileRepository,
    memoryRepository,
    useCases: {
      loadJourney: new LoadJourneyUseCase(journeyRepository),
      clearJourney: new ClearJourneyUseCase(journeyRepository),
      sendChatMessage: new SendChatMessageUseCase(ai, journeyRepository),
      loadMemories: new LoadMemoriesUseCase(memoryRepository),
    },
  };
  return cached;
}
