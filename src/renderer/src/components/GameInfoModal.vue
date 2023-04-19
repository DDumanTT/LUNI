<template>
  <Dialog
    v-model:visible="visible"
    :min-y="24"
    :breakpoints="{ '1536px': '60%', '1024px': '80%', '860px': '100%' }"
    class="w-1/2 overflow-hidden"
    content-class="min-h-[24rem]"
    modal
    dismissable-mask
    append-to="#main"
  >
    <template v-if="!loading" #header>
      <span class="header">
        <img
          v-if="props.game.icon"
          :src="`appdata://${props.game.icon}`"
          :alt="`${props.game.name} icon`"
          class="h-8 w-8"
        />
        <span class="title">
          {{ props.game.name }}
        </span>
        <div class="launcher">
          <i :class="`pi ${getLauncherIcon(props.game.launcher)}`" />
          <span>{{ getLauncherName(props.game.launcher) }}</span>
        </div>
      </span>
      <div v-if="coverUrl" class="header-cover">
        <img :src="coverUrl" class="cover" draggable="false" />
      </div>
    </template>
    <template v-else #header>
      <div class="w-full" />
    </template>
    <template v-if="loading">
      <div class="spinner">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem" />
      </div>
    </template>
    <template v-else-if="gameData">
      <div class="info-section flex-section flex-wrap justify-around !gap-4">
        <div v-if="gameData.first_release_date" class="flex-section">
          <h4>Release date:</h4>
          <p>{{ release_date }}</p>
        </div>
        <div v-if="gameData.genres" class="flex-section">
          <h4>Genres:</h4>
          <span>{{ gameData.genres.map((g) => g.name).join(', ') }}</span>
        </div>
        <div v-if="gameData.themes" class="flex-section">
          <h4>Themes:</h4>
          <span>{{ gameData.themes.map((g) => g.name).join(', ') }}</span>
        </div>
        <div v-if="gameData.game_modes" class="flex-section">
          <h4>Game modes:</h4>
          <span>{{ gameData.game_modes.map((g) => g.name).join(', ') }}</span>
        </div>
        <div v-if="gameData.player_perspectives" class="flex-section">
          <h4>Player perspectives:</h4>
          <span>{{ gameData.player_perspectives.map((g) => g.name).join(', ') }}</span>
        </div>
        <div v-if="gameData.aggregated_rating" class="flex-section">
          <h4>Rating:</h4>
          {{ rating.toFixed(1) }}/5
          <Rating :model-value="+rating.toFixed()" :cancel="false" />
        </div>
      </div>
      <div v-if="gameData.summary" class="info-section">
        <p>{{ gameData.summary }}</p>
      </div>
      <div v-if="gameData.platforms" class="info-section flex-section">
        <h4>Platforms:</h4>
        <div class="flex-section flex-wrap">
          <span
            v-for="(platform, index) of gameData.platforms"
            :key="platform.id"
            class="inline-block whitespace-pre-wrap"
          >
            <i class="pi pi-external" />
            <a :href="platform.websites?.[0].url" target="_blank">{{ platform.name }}</a>
            <span v-if="index < gameData.platforms.length - 1">,</span>
          </span>
        </div>
      </div>
      <div class="info-section">
        <h4>Screenshots</h4>
        <Swiper
          :slides-per-view="2"
          :space-between="32"
          :modules="[Scrollbar]"
          :scrollbar="{ draggable: true }"
          grab-cursor
          class="h-fit w-full"
        >
          <SwiperSlide v-for="(screenshot, index) of gameData.screenshots" :key="screenshot.id">
            <img :src="getScreenshotUrl(index)" class="rounded" />
          </SwiperSlide>
        </Swiper>
      </div>
      <div v-if="gameData.involved_companies" class="info-section flex-section !items-start">
        <div v-if="developers?.length" class="flex-1">
          <h4>Developers</h4>
          <div v-for="(company, index) of developers" :key="company.id" class="flex gap-2">
            <img
              v-if="company.logo"
              :src="getDeveloperLogoUrl(index)"
              class="h-6 w-6 rounded-full"
            />
            <a :href="company.websites?.[0].url" target="_blank">{{ company.name }}</a>
          </div>
        </div>
        <div v-if="publishers?.length" class="flex-1">
          <h4>Publishers</h4>
          <div v-for="(company, index) of publishers" :key="company.id" class="flex gap-2">
            <img
              v-if="company.logo"
              :src="getPublisherLogoUrl(index)"
              class="h-6 w-6 rounded-full"
            />
            <a :href="company.websites?.[0].url" target="_blank">{{ company.name }}</a>
          </div>
        </div>
      </div>
      <div v-if="gameData.alternative_names" class="info-section">
        <h4>Alternative titles</h4>
        <div v-for="title of gameData.alternative_names" :key="title.id">
          {{ title.comment }}: {{ title.name }}
        </div>
      </div>
      <div v-if="gameData.websites" class="info-section">
        <h4>Websites</h4>
        <div class="grid-section">
          <div
            v-for="website of gameData.websites"
            :key="website.id"
            class="flex items-center gap-1"
          >
            <template v-if="website.category">
              <i
                :class="[
                  websiteCategories[website.category - 1].icon,
                  'h-6 w-6 text-center !leading-[unset]',
                ]"
              />
              <a :href="website.url" target="_blank">{{
                websiteCategories[website.category - 1].name
              }}</a>
            </template>
          </div>
        </div>
      </div>
      <div v-if="gameData.language_supports" class="info-section">
        <DataTable :value="languageSupportsTableItems" class="p-datatable-sm">
          <Column field="language" header="Language supports"></Column>
          <Column
            v-for="col of ['Audio', 'Subtitles', 'Interface']"
            :key="col"
            :field="col.toLowerCase()"
            :header="col"
            header-class="support-header"
          >
            <template #body="slotProps">
              <div v-if="slotProps.data[slotProps.field]" class="check">
                <i class="pi pi-check" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
interface GameInfoProps {
  game: Game;
  visible: boolean;
}
interface LanguageSupportsTableItem {
  language: string;
  audio: boolean;
  subtitles: boolean;
  interface: boolean;
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { HttpsCallableResult } from '@firebase/functions';
import Dialog from 'primevue/dialog';
import Rating from 'primevue/rating';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Scrollbar } from 'swiper';

import { Game, IgdbGame } from '@shared/types';
import { getGameData } from '@renderer/firebase/functions';
import { getLauncherName, getLauncherIcon } from '@renderer/utils';

const props = defineProps<GameInfoProps>();
const emit = defineEmits(['hide']);

const websiteCategories = [
  { name: 'Official Website', icon: 'fa-solid fa-up-right-from-square' },
  { name: 'Wikia', icon: 'fa-brands fa-wikipedia-w' },
  { name: 'Wikipedia', icon: 'fa-brands fa-wikipedia-w' },
  { name: 'Facebook', icon: 'pi pi-facebook' },
  { name: 'Twitter', icon: 'pi pi-twitter' },
  { name: 'Twitch', icon: 'fa-brands fa-twitch' },
  { name: '', icon: '' },
  { name: 'Instagram', icon: 'pi pi-instagram' },
  { name: 'Youtube', icon: 'pi pi-youtube' },
  { name: 'Iphone', icon: 'pi pi-apple' },
  { name: 'Ipad', icon: 'pi pi-apple' },
  { name: 'Android', icon: 'pi pi-android' },
  { name: 'Steam', icon: 'fa-brands fa-steam' },
  { name: 'Reddit', icon: 'pi pi-reddit' },
  { name: 'Itch', icon: 'fa-brands fa-itch-io' },
  { name: 'Epic Games', icon: 'pi pi-epic' },
  { name: 'GOG', icon: 'fa-solid fa-gamepad' },
  { name: 'Discord', icon: 'pi pi-discord' },
];

const visible = ref(props.visible);
const loading = ref(true);
const gameData = ref<IgdbGame | undefined>();

watch(props, () => {
  visible.value = props.visible;
});
watch(visible, (value) => {
  if (!value) return emit('hide');
  handleGetGameInfo();
});

const coverUrl = computed(() => {
  if (!gameData.value) return '';
  return `https://images.igdb.com/igdb/image/upload/t_1080p/${gameData.value.cover.image_id}.jpg`;
});
const rating = computed(() => (gameData.value ? (gameData.value.aggregated_rating * 5) / 100 : 0));
const release_date = computed(() =>
  gameData.value
    ? new Date(gameData.value.first_release_date * 1000).toISOString().slice(0, 10)
    : ''
);
const developers = computed(() =>
  gameData.value?.involved_companies.filter((c) => c.developer).map((c) => c.company)
);
const publishers = computed(() =>
  gameData.value?.involved_companies.filter((c) => c.publisher).map((c) => c.company)
);
const languageSupportsTableItems = computed<LanguageSupportsTableItem[]>(() => {
  if (!gameData.value?.language_supports) return [];
  const inserted = {} as Record<string, number>;
  const res = [] as LanguageSupportsTableItem[];
  for (const item of gameData.value.language_supports) {
    if (!(item.language.name in inserted)) {
      const index =
        res.push({
          language: item.language.name,
          audio: item.language_support_type.name === 'Audio',
          subtitles: item.language_support_type.name === 'Subtitles',
          interface: item.language_support_type.name === 'Interface',
        }) - 1;
      inserted[item.language.name] = index;
    } else {
      const lang = res[inserted[item.language.name]];
      lang[item.language_support_type.name.toLowerCase()] = true;
    }
  }
  return res;
});

const getScreenshotUrl = (index: number) => {
  if (!gameData.value) return '';
  return `https://images.igdb.com/igdb/image/upload/t_720p/${gameData.value.screenshots[index].image_id}.jpg`;
};
const getDeveloperLogoUrl = (index: number) => {
  if (!developers.value) return '';
  return `https://images.igdb.com/igdb/image/upload/t_micro/${developers.value[index].logo.image_id}.jpg`;
};
const getPublisherLogoUrl = (index: number) => {
  if (!publishers.value) return '';
  return `https://images.igdb.com/igdb/image/upload/t_micro/${publishers.value[index].logo.image_id}.jpg`;
};

const handleGetGameInfo = async () => {
  const res = (await getGameData(props.game.name)) as HttpsCallableResult<IgdbGame>;
  gameData.value = res.data;
  loading.value = false;
};
</script>

<style scoped lang="postcss">
.spinner {
  min-width: 16rem;
  min-height: 16rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-overflow: ellipsis;
  width: 100%;
  .title {
    font-weight: bold;
    font-size: 2rem;
  }
  .launcher {
    flex: 1;
    gap: 0.5rem;
    padding-right: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.header-cover {
  width: 100%;
  mask-image: linear-gradient(to bottom, rgb(0, 0, 0, 0.2), transparent);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  filter: blur(8px);
}
.cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.info-section {
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  h3 {
    font-size: 1.5rem;
  }
  h4 {
    font-weight: bold;
  }
  a {
    text-decoration: underline;
    color: var(--primary-color);
    white-space: nowrap;
  }
}
.flex-section {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.grid-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  column-gap: 1rem;
}
.rounded {
  border-radius: var(--border-radius);
}
.check {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.support-header .p-column-header-content) {
  justify-content: center;
}
:deep(.p-datatable) {
  position: unset;
}
</style>
