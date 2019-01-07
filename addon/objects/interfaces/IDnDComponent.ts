export default interface IDnDComponent {

    dragEnter(event: DragEvent): void;
    dragLeave(event: DragEvent): void
    dragOver(event: DragEvent): void
    drop(event: DragEvent): void

}
