/**
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
	const uploadOption = document.getElementById('uploadOption');
	const selectOption = document.getElementById('selectOption');
	const fileInput = document.getElementById('itemImage');
	const imageSelectArea = document.getElementById('imageSelectArea');
	const preview = document.getElementById('preview');

	if (!uploadOption || !selectOption) return;

	uploadOption.addEventListener('change', () => {
		fileInput.style.display = 'block';
		imageSelectArea.style.display = 'none';
		preview.style.display = 'none';
	});

	selectOption.addEventListener('change', () => {
		fileInput.style.display = 'none';
		imageSelectArea.style.display = 'block';
		preview.style.display = 'none';
	});

	// アップロードファイル選択時 → プレビュー表示
	fileInput?.addEventListener('change', function() {
		if (this.files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				preview.src = e.target.result;
				preview.style.display = 'block';
			};
			reader.readAsDataURL(this.files[0]);
		}
	});

	// 既存画像選択時 → プレビュー＆hiddenに反映
	document.querySelectorAll('input[name="selectedImage"]').forEach(radio => {
		radio.addEventListener('change', function() {
			const src = this.nextElementSibling.src;
			preview.src = src;
			preview.style.display = 'block';
			document.getElementById("selectedImageName").value = this.value;
		});
	});
});
