/**
 * 管理画面：画像アップロード・選択ハンドラー
 */
document.addEventListener('DOMContentLoaded', () => {
	const uploadOption = document.getElementById('uploadOption');
	const selectOption = document.getElementById('selectOption');
	const fileInput = document.getElementById('itemImage');
	const imageSelectArea = document.getElementById('imageSelectArea');
	const preview = document.getElementById('preview');
	const selectedImageInput = document.getElementById('selectedImageName');

	// 店舗IDの取得
	const shopId = document.querySelector('input[name="shopId"]')?.value;
	if (!shopId) return;

	// 🔁 アップロード済み画像を取得して表示
	fetch(`/admin/${shopId}_dashboard/workstation/menu/image_list`)
		.then(res => res.json())
		.then(imageList => {
			if (!imageSelectArea) return;
			imageSelectArea.innerHTML = ""; // 一度クリア

			imageList.forEach(filename => {
				const radioId = "radio_" + filename.replace(/\W/g, "");

				const wrapper = document.createElement("div");
				wrapper.className = "d-inline-block m-1";

				wrapper.innerHTML = `
					<label class="d-block text-center">
						<input type="radio" name="selectedImage" value="${filename}" id="${radioId}" class="form-check-input" />
						<img src="/uploads/menu/${shopId}/${filename}" class="img-thumbnail" style="height: 80px;" />
					</label>
				`;

				imageSelectArea.appendChild(wrapper);

				// プレビュー連動（選択時）
				wrapper.querySelector("input[type=radio]").addEventListener("change", function() {
					selectedImageInput.value = this.value;
					preview.src = `/uploads/menu/${shopId}/${this.value}`;
					preview.style.display = "block";
				});
			});
		})
		.catch(err => {
			console.error("画像一覧取得エラー:", err);
		});

	// ラジオ切り替えによる表示制御
	if (uploadOption && selectOption) {
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
	}

	// ファイル選択時のプレビュー（アップロード）
	fileInput?.addEventListener('change', function() {
		if (this.files && this.files[0]) {
			const reader = new FileReader();
			reader.onload = (e) => {
				preview.src = e.target.result;
				preview.style.display = 'block'; // ← 忘れがち
			};
			reader.readAsDataURL(this.files[0]);
		}
	});

	// ラジオで選択した画像のプレビュー（アップロード済）
	document.querySelectorAll('input[name="selectedImage"]').forEach(input => {
		input.addEventListener('change', function() {
			const filename = this.value;
			const shopId = document.querySelector('input[name="shopId"]').value;
			const fullPath = `/uploads/menu/${shopId}/${filename}`;
			document.getElementById("preview").src = fullPath;
			document.getElementById("preview").style.display = 'block';
		});
	});

});
