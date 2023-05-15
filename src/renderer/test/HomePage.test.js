import { mount } from '@vue/test-utils';
import HomePage from '../src/routes/HomePage.vue';
import Hero from '@renderer/components/Hero.vue';
import Panel from 'primevue/panel';
import GameSlider from '@renderer/components/GameSlider.vue';

describe('HomePage', () => {
  it('renders fallback section when no games are imported', () => {
    const wrapper = mount(HomePage);
    expect(wrapper.find('.fallback').exists()).toBe(true);
    expect(wrapper.find('.game-section').exists()).toBe(false);
  });

  it('renders game sections when games are imported', () => {
    const gamesStore = {
      games: [{ id: 1 }, { id: 2 }],
      favoriteGames: [{ id: 1 }],
      recentGames: [{ id: 2 }],
    };
    const wrapper = mount(HomePage, {
      global: {
        provide: {
          gamesStore,
        },
      },
    });

    expect(wrapper.find('.fallback').exists()).toBe(false);
    expect(wrapper.find('.game-section').exists()).toBe(true);
  });

  it('renders Hero component with correct game prop', () => {
    const gamesStore = {
      games: [{ id: 1 }, { id: 2 }],
    };
    const heroGameIndex = 1;
    const wrapper = mount(HomePage, {
      global: {
        provide: {
          gamesStore,
        },
      },
      data() {
        return {
          heroGameIndex,
        };
      },
    });

    const heroComponent = wrapper.findComponent(Hero);
    expect(heroComponent.exists()).toBe(true);
    expect(heroComponent.props('game')).toBe(gamesStore.games[heroGameIndex]);
  });

  it('renders Panel components with correct headers', () => {
    const gamesStore = {
      games: [{ id: 1 }],
      favoriteGames: [{ id: 1 }],
      recentGames: [],
    };
    const wrapper = mount(HomePage, {
      global: {
        provide: {
          gamesStore,
        },
      },
    });

    const panelComponents = wrapper.findAllComponents(Panel);
    expect(panelComponents.length).toBe(2);
    expect(panelComponents[0].props('header')).toBe('RECENTLY PLAYED');
    expect(panelComponents[1].props('header')).toBe('FAVORITES');
  });

  it('renders GameSlider components with correct games prop', () => {
    const gamesStore = {
      games: [{ id: 1 }],
      favoriteGames: [{ id: 1 }],
      recentGames: [{ id: 1 }],
    };
    const wrapper = mount(HomePage, {
      global: {
        provide: {
          gamesStore,
        },
      },
    });

    const gameSliderComponents = wrapper.findAllComponents(GameSlider);
    expect(gameSliderComponents.length).toBe(2);
    expect(gameSliderComponents[0].props('games')).toBe(
      gamesStore.recentGames.filter((game) => game.id !== gamesStore.games[0].id)
    );
    expect(gameSliderComponents[1].props('games')).toBe(gamesStore.favoriteGames);
  });
});
