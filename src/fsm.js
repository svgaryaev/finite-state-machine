class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config || !config.initial || !config.states || !Object.keys(config.states).length) {
            throw new Error('Incomplete or no config specified');
        }
        this._state = this._initial = config.initial;
        this._states = config.states;
        this._history = {
            step: 0,
            states: [this._initial]
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (state in this._states) {
            this._state = state;
            // if state is changing after undo rewrite history
            if (this._history.step < this._history.states.length - 1) {
                this._history.states.splice(this._history.step + 1);
            }
            ++this._history.step;
            this._history.states.push(state);
        } else {
            throw new Error('There is no state with this name');
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        const transitions = this._states[this._state].transitions;
        if (transitions && event in transitions) {
            this.changeState(transitions[event]);
        } else {
            throw new Error('Current state have no this transition')
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        // TODO should this method clear history?
        this._state = this._initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        const states = Object.keys(this._states);
        return event
            ? states.filter(state => this._states[state].transitions && this._states[state].transitions[event])
            : states;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this._history.step) {
            return false;
        }
        this._state = this._history.states[--this._history.step];
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._history.step === this._history.states.length - 1) {
            return false;
        }
        this._state = this._history.states[++this._history.step];
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._history.step = 0;
        this._history.states = [this._initial];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
