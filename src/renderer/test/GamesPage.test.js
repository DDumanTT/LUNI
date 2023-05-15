import { mount } from '@vue/test-utils';
import GamesPage from '../src/routes/GamesPage.vue';

describe('GamesPage', () => {
  it('renders the component', () => {
    const wrapper = mount(GamesPage);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the search input', () => {
    const wrapper = mount(GamesPage);
    const searchInput = wrapper.findComponent({ name: 'Input' });
    expect(searchInput.exists()).toBe(true);
  });

  it('opens the filter menu when the "Filter" button is clicked', async () => {
    const wrapper = mount(GamesPage);
    const filterButton = wrapper.findComponent({ name: 'Button' });
    await filterButton.trigger('click');
    const overlayPanel = wrapper.findComponent({ name: 'OverlayPanel' });
    expect(overlayPanel.exists()).toBe(true);
  });

  it('displays the add game dialog when the "Add game" button is clicked', async () => {
    const wrapper = mount(GamesPage);
    const addButton = wrapper.findComponent({ name: 'Button', props: { label: 'Add game' } });
    await addButton.trigger('click');
    const dialog = wrapper.findComponent({ name: 'Dialog' });
    expect(dialog.exists()).toBe(true);
  });

  it('renders game cards in grid layout', () => {
    const wrapper = mount(GamesPage);
    const gameCards = wrapper.findAllComponents({ name: 'GameCard' });
    expect(gameCards.length).toBeGreaterThan(0);
  });

  it('filters games based on search input', async () => {
    const wrapper = mount(GamesPage);
    const searchInput = wrapper.findComponent({ name: 'Input' });
    await searchInput.setValue('game name');
    const gameCards = wrapper.findAllComponents({ name: 'GameCard' });
    expect(gameCards.length).toBeGreaterThan(0);
    gameCards.forEach((gameCard) => {
      const gameName = gameCard.find('.game-name').text();
      expect(gameName.toLowerCase()).toContain('game name');
    });
  });

  it('filters games based on launcher filter', async () => {
    const wrapper = mount(GamesPage);
    const filterCheckbox = wrapper.find('input[type="checkbox"]');
    await filterCheckbox.setChecked();
    const gameCards = wrapper.findAllComponents({ name: 'GameCard' });
    expect(gameCards.length).toBeGreaterThan(0);
    gameCards.forEach((gameCard) => {
      const gameLauncher = gameCard.find('.game-launcher').text();
      expect(['steam', 'epic', 'ea', 'ubisoft', 'custom']).toContain(gameLauncher);
    });
  });
});
