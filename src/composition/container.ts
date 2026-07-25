import { AddInboxItemUseCase } from "@/application/AddInboxItemUseCase";
import { ClearJourneyUseCase } from "@/application/ClearJourneyUseCase";
import { ContextEngine } from "@/application/ContextEngine";
import { DiscardInboxItemUseCase } from "@/application/DiscardInboxItemUseCase";
import { LoadInboxUseCase } from "@/application/LoadInboxUseCase";
import { LoadJourneyUseCase } from "@/application/LoadJourneyUseCase";
import { LoadMemoriesUseCase } from "@/application/LoadMemoriesUseCase";
import { MarkInboxItemProcessedUseCase } from "@/application/MarkInboxItemProcessedUseCase";
import { SendChatMessageUseCase } from "@/application/SendChatMessageUseCase";
import type { AIService } from "@/domain/ports/AIService";
import type { InboxRepository } from "@/domain/ports/InboxRepository";
import type { JourneyRepository } from "@/domain/ports/JourneyRepository";
import type { MemoryRepository } from "@/domain/ports/MemoryRepository";
import type { UserProfileRepository } from "@/domain/ports/UserProfileRepository";
import { OpenRouterCompanionAIService } from "@/infrastructure/ai/OpenRouterCompanionAIService";
import { LocalStorageInboxRepository } from "@/infrastructure/storage/LocalStorageInboxRepository";
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
  inboxRepository: InboxRepository;
  useCases: {
    loadJourney: LoadJourneyUseCase;
    clearJourney: ClearJourneyUseCase;
    sendChatMessage: SendChatMessageUseCase;
    loadMemories: LoadMemoriesUseCase;
    loadInbox: LoadInboxUseCase;
    addInboxItem: AddInboxItemUseCase;
    markInboxItemProcessed: MarkInboxItemProcessedUseCase;
    discardInboxItem: DiscardInboxItemUseCase;
  };
}

let cached: CompanionContainer | null = null;

export function getContainer(): CompanionContainer {
  if (cached) return cached;

  const ai: AIService = new OpenRouterCompanionAIService();
  const journeyRepository: JourneyRepository = new LocalStorageJourneyRepository();
  const profileRepository: UserProfileRepository = new LocalStorageUserProfileRepository();
  const memoryRepository: MemoryRepository = new LocalStorageMemoryRepository();
  const inboxRepository: InboxRepository = new LocalStorageInboxRepository();
  const contextEngine = new ContextEngine(
    journeyRepository,
    memoryRepository,
    profileRepository,
  );

  cached = {
    ai,
    journeyRepository,
    profileRepository,
    memoryRepository,
    inboxRepository,
    useCases: {
      loadJourney: new LoadJourneyUseCase(journeyRepository),
      clearJourney: new ClearJourneyUseCase(journeyRepository),
      sendChatMessage: new SendChatMessageUseCase(
        ai,
        journeyRepository,
        contextEngine,
      ),
      loadMemories: new LoadMemoriesUseCase(memoryRepository),
      loadInbox: new LoadInboxUseCase(inboxRepository),
      addInboxItem: new AddInboxItemUseCase(inboxRepository),
      markInboxItemProcessed: new MarkInboxItemProcessedUseCase(inboxRepository),
      discardInboxItem: new DiscardInboxItemUseCase(inboxRepository),
    },
  };
  return cached;
}
