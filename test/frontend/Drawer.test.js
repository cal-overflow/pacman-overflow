import { generateFakeItemsMixed, generateFakePlayers, generateFakeTextElements } from '../MockGenerators.js';
import {
  drawItems,
  drawFlashingItems,
  drawPlayers,
  drawTextElements
} from '@/frontend/Drawer.js';
import Chance from 'chance';

const chance = new Chance();



describe('Drawer', () => {
  let mockItems, mockPlayers, mockTextElements, mockBoard;
  let mockCtx;

  beforeEach(() => {   
    mockBoard = {
      width: chance.integer({ min: 0 }),
      height: chance.integer({ min: 0 })
    };

    mockCtx = {
      fillStyle: '#000000',
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      fillText: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn()
    };
  });

  afterEach(jest.clearAllMocks);

  describe('drawItems', () => {
    beforeEach(() => {
      mockItems = generateFakeItemsMixed();

      drawItems(mockItems, mockCtx, mockBoard);
    });

    it('should clear the canvas', () => {
      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, mockBoard.width, mockBoard.height);
    });

    it('should draw each non-flashing item', () => {
      const nonFlashingItems = mockItems.filter(({isFlashing}) => !isFlashing);
      expect(mockCtx.stroke).toHaveBeenCalledTimes(nonFlashingItems.length);
    });
  });

  describe('drawFlashingItems', () => {
    beforeEach(() => {
      mockItems = generateFakeItemsMixed();

      drawFlashingItems(mockItems, mockCtx, mockBoard, true);
    });

    it('should clear the canvas', () => {
      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, mockBoard.width, mockBoard.height);
    });

    it('should draw each flashing item', () => {
      const flashingItems = mockItems.filter(({isFlashing}) => isFlashing);
      expect(mockCtx.stroke).toHaveBeenCalledTimes(flashingItems.length);
    });
  });

  describe('drawPlayers', () => {
    beforeEach(() => {
      mockPlayers = generateFakePlayers();

      drawPlayers(mockPlayers, mockCtx, mockBoard);
    });

    it('should clear the canvas', () => {
      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, mockBoard.width, mockBoard.height);
    });

    it('should draw each player', () => {
      expect(mockCtx.fillRect).toHaveBeenCalledTimes(mockPlayers.length);
    });
  });

  describe('drawTextElements', () => {
    beforeEach(() => {
      mockTextElements = generateFakeTextElements();

      drawTextElements(mockTextElements, mockCtx, mockBoard);
    });

    it('should clear the canvas', () => {
      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, mockBoard.width, mockBoard.height);
    });

    it('should draw each text element', () => {
      expect(mockCtx.fillText).toHaveBeenCalledTimes(mockTextElements.length);
    });
  });
});
